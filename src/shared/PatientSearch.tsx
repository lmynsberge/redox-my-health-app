import { Button, DatePicker, Form, Input, Radio } from 'antd';
import React from 'react';
import { DateTime } from 'luxon';
import moment from 'moment';
import {
  makePatientLocationSearch,
  makePatientSearch,
  makeSummaryDocumentGet,
  makeSummaryDocumentQuery,
  PatientSearchRequest,
} from '../services/redoxengine/client';
import { XsltViewer } from '../XMLViewer';

export interface PatientSearchForm {
  firstName: string;
  lastName: string;
  dob: any;
  sex: 'male' | 'female' | 'other' | 'unknown' | 'nonbinary';
  ssn?: string;
  city?: string;
  state?: string;
  zip?: string;
}

const getPatientDocumentList = async (req: PatientSearchRequest) => {
  // Later let's add in some error cases
  const psQueryR = await makePatientSearch(req);
  if (!psQueryR.Patient.Identifiers.length) {
    throw new Error('Unexpected Redox response, no patient');
  }
  const psLocationQueryR = await makePatientLocationSearch({
    redoxPatientId: psQueryR.Patient.Identifiers[0].ID,
    redoxPatientIdType: psQueryR.Patient.Identifiers[0].IDType,
  });
  const csDocQueryListR = await Promise.all(
    psLocationQueryR.Patients.map((p) => {
      // Only get the Organization ID
      const facilityCode = p.Organization.Identifiers.find(
        (id) => id.IDType === 'OID'
      );
      if (!facilityCode) {
        throw new Error('Unexpected Redox response, no organization OID');
      }
      const patientIdSet = p.Identifiers.find(
        (id) => id.IDType === facilityCode.ID
      );
      if (!patientIdSet) {
        throw new Error(
          'Unexpected Redox response, no patient ID for this organization'
        );
      }
      console.log('making doc query request', {
        facilityCode: facilityCode.ID,
        patientId: patientIdSet.ID,
        patientIdType: patientIdSet.IDType,
      });
      return makeSummaryDocumentQuery({
        facilityCode: facilityCode.ID,
        patientId: patientIdSet.ID,
        patientIdType: patientIdSet.IDType,
      });
    })
  );
  const fullDocumentList = csDocQueryListR.flatMap((res) =>
    res.Documents.map((doc) => ({
      docId: doc.ID,
      docType: doc.Type.Code,
      endDateTime: doc.Visit.EndDateTime,
      facilityCode: res.Patient.Identifiers[0].IDType,
    }))
  );
  const episodeSummaryDocList = fullDocumentList
    .filter((doc) => doc.docType === '34133-9')
    .sort((docA, docB) => {
      const docBTime = DateTime.fromISO(docB.endDateTime);
      const docATime = DateTime.fromISO(docA.endDateTime);
      return docBTime.toMillis() - docATime.toMillis();
    });
  // No valid doc that we care about
  if (!episodeSummaryDocList.length) {
    console.log("Didn't find a doc we care about", fullDocumentList);
    return undefined;
  }
  const fullDocR = await makeSummaryDocumentGet({
    documentId: episodeSummaryDocList[0].docId,
    facilityCode: episodeSummaryDocList[0].facilityCode,
  });
  return fullDocR.Data;
};

export const PatientSearch: React.FC = () => {
  const [form] = Form.useForm();
  const [submitDisabled, setSubmitDisabled] = React.useState<boolean>(false);
  const [formValues, setFormValues] = React.useState<
    Partial<PatientSearchForm>
  >({
    firstName: 'Adolfo',
    lastName: 'Kessler',
    dob: moment('2002-10-31', 'YYYY-MM-DD'),
    ssn: '999-55-2115',
    sex: 'male',
    city: 'Madison',
    state: 'Wisconsin',
    zip: '53711',
  });
  const [ccdData, setCcdData] = React.useState<string>();
  const [docQueryComplete, setDocQueryComplete] = React.useState<boolean>(
    false
  );

  const onPatientSearchChange = (vals: Partial<PatientSearchForm>) => {
    setFormValues({
      ...formValues,
      ...vals,
    });
  };
  const onFinish = async () => {
    setSubmitDisabled(true);
    console.log('making API call', formValues);
    try {
      const ccdData = await getPatientDocumentList({
        ...formValues,
        dob: DateTime.fromJSDate(
          ((formValues.dob as unknown) as { toDate: () => Date }).toDate()
        ),
        address: {
          city: formValues.city,
          state: formValues.state,
          zip: formValues.zip,
        },
      });
      ccdData && setCcdData(ccdData);
      setDocQueryComplete(true);
    } catch (err) {
      console.log('error while getting documents');
      console.error(err);
    } finally {
      setSubmitDisabled(false);
    }
  };

  return docQueryComplete ? (
    <div>
      {ccdData ? <XsltViewer xml={ccdData} /> : 'No document found for patient'}
    </div>
  ) : (
    <Form
      layout="vertical"
      form={form}
      initialValues={formValues}
      onValuesChange={onPatientSearchChange}
    >
      <Form.Item
        label="First Name"
        name="firstName"
        rules={[
          {
            required: true,
            message: 'Please define a name',
          },
        ]}
      >
        <Input placeholder="Jane" />
      </Form.Item>
      <Form.Item
        label="Last Name"
        name="lastName"
        rules={[
          {
            required: true,
            message: 'Please define a name',
          },
        ]}
      >
        <Input placeholder="Doe" />
      </Form.Item>
      <Form.Item
        label="Date of Birth"
        name="dob"
        rules={[
          {
            required: true,
            message: 'Please select a date',
          },
        ]}
      >
        <DatePicker />
      </Form.Item>
      <Form.Item
        label="Sex"
        name="sex"
        rules={[
          {
            required: true,
            message: 'Please select a sex',
          },
        ]}
      >
        <Radio.Group value={'horizontal'}>
          <Radio.Button value="female">Female</Radio.Button>
          <Radio.Button value="male">Male</Radio.Button>
          <Radio.Button value="other">Other/Non-Binary</Radio.Button>
        </Radio.Group>
      </Form.Item>
      <Form.Item label="SSN" name="ssn">
        <Input placeholder="999-99-9999" />
      </Form.Item>
      <Form.Item label="City" name="city">
        <Input placeholder="Madison" />
      </Form.Item>
      <Form.Item
        label="State"
        name="state"
        rules={[
          {
            required: false,
            message: 'Must be 2 digit state',
          },
        ]}
      >
        <Input placeholder="WI" />
      </Form.Item>
      <Form.Item label="ZIP" name="zip">
        <Input placeholder="53711" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" disabled={submitDisabled} onClick={onFinish}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};
