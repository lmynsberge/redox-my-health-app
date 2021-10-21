import { AxiosResponse } from 'axios';
import { get } from 'lodash';
import { DateTime } from 'luxon';
import { stringify } from 'querystring';

import { appConfig } from '../../appConfig';
import { httpClient } from '../client';

const apiKey = appConfig.API_KEY;
const secret = appConfig.API_SECRET;

let tokenInfo: {
  accessToken?: string;
} = {
  accessToken: undefined,
};
const getAccessToken = async () => {
  const res = await httpClient.post<
    string,
    AxiosResponse<{ accessToken: string }>
  >(
    'https://cors-anywhere.herokuapp.com/https://api.redoxengine.com/auth/authenticate',
    stringify({
      apiKey,
      secret,
      grant_type: 'client_credentials',
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      responseType: 'json',
    }
  );

  console.log('typeof', typeof res.data);
  console.log('res', res.data);
  return res.data.accessToken;
};

export interface PatientSearchRequest {
  firstName?: string;
  lastName?: string;
  dob?: DateTime;
  ssn?: string;
  sex?: 'male' | 'female' | 'other' | 'unknown' | 'nonbinary';
  address?: {
    city?: string;
    state?: string;
    zip?: string;
  };
}

export interface PatientSearchResponse {
  Meta: {
    DataModel: 'PatientSearch';
    EventType: 'Query';
    Logs: Array<{
      ID: string;
      AttemptID: string;
    }>;
  };
  Patient: {
    Identifiers: Array<{
      IDType: string;
      ID: string;
    }>;
  };
}

export const makePatientSearch = async (
  req: PatientSearchRequest
): Promise<PatientSearchResponse> => {
  if (!tokenInfo.accessToken) {
    const accessToken = await getAccessToken();
    tokenInfo.accessToken = accessToken;
  }
  console.log('making patient search', tokenInfo.accessToken);
  const res = await httpClient.post<
    Record<string, unknown>,
    AxiosResponse<PatientSearchResponse>
  >(
    'https://cors-anywhere.herokuapp.com/https://api.redoxengine.com/endpoint',
    {
      Meta: {
        Extensions: {
          'sender-organization-id': {
            url:
              'https://api.redoxengine.com/extensions/sender-organization-id',
            // This value is defined based on environment, so you'll have a different value for the sandbox than production
            // It will be unique to your organization. Typically there is just one
            string: '2.16.840.1.113883.3.6147.458.5420.1.1.2',
          },
          'user-id': {
            url: 'https://api.redoxengine.com/extensions/user-id',
            // This should change per query and should be a user ID in your system for tracking (shouldn't be the name either like this unless that's your primary key)
            string: 'Doolittle, John',
          },
          'user-role': {
            url: 'https://api.redoxengine.com/extensions/user-role',
            // Depends on your user role, this is a SNOMED CT code
            // See here: https://www.hl7.org/fhir/valueset-practitioner-role.html
            coding: {
              code: '112247003',
              display: 'Medical Doctor',
            },
          },
          'purpose-of-use': {
            url: 'https://api.redoxengine.com/extensions/purpose-of-use',
            // ALWAYS treatment -> depends on the app purpose, but typically this is treatment
            // If it wasn't, other organizations on the network likely wouldn't respond
            // To use this, you have to participate in the network, which is why you also have to push data
            coding: {
              code: 'TREATMENT',
              display: 'Treatment',
            },
          },
        },
        DataModel: 'PatientSearch',
        EventType: 'Query',
        Test: true,
        Destinations: [
          {
            ID: 'adf917b5-1496-4241-87e2-ed20434b1fdb',
          },
        ],
      },
      Patient: {
        Demographics: {
          // These will change for whatever information you have, see our API documentation for supported fields
          FirstName: req.firstName,
          LastName: req.lastName,
          DOB: req.dob?.toFormat('yyyy-LL-dd'),
          SSN: req.ssn,
          Sex: req.sex
            ? req.sex[0].toUpperCase() + req.sex.slice(1)
            : undefined,
          Address: {
            City: req.address?.city,
            State: req.address?.state,
            ZIP: req.address?.zip,
          },
        },
      },
    },
    {
      headers: {
        Authorization: `Bearer ${tokenInfo.accessToken}`,
      },
    }
  );

  console.log('typeof res', typeof res.data);
  console.log('res', res);

  return res.data;
};

export interface PatientLocationSearchRequest {
  redoxPatientId: string;
  redoxPatientIdType: string;
}

export interface PatientLocationSearchResponse {
  Meta: {
    DataModel: 'PatientSearch';
    EventType: 'LocationQuery';
    Logs: Array<{
      ID: string;
      AttemptID: string;
    }>;
  };
  Patients: [
    {
      Identifiers: Array<{
        IDType: string;
        ID: string;
      }>;
      Organization: {
        Identifiers: Array<{
          IDType: string;
          ID: string;
        }>;
      };
    }
  ];
}

export const makePatientLocationSearch = async (
  req: PatientLocationSearchRequest
): Promise<PatientLocationSearchResponse> => {
  if (!tokenInfo.accessToken) {
    const accessToken = await getAccessToken();
    tokenInfo.accessToken = accessToken;
  }
  console.log('making patient location search', tokenInfo.accessToken);
  const res = await httpClient.post<
    Record<string, unknown>,
    AxiosResponse<PatientLocationSearchResponse>
  >(
    'https://cors-anywhere.herokuapp.com/https://api.redoxengine.com/endpoint',
    {
      Meta: {
        Extensions: {
          'sender-organization-id': {
            url:
              'https://api.redoxengine.com/extensions/sender-organization-id',
            string: '2.16.840.1.113883.3.6147.458.5420.1.1.2',
          },
          'user-id': {
            url: 'https://api.redoxengine.com/extensions/user-id',
            string: 'Doolittle, John',
          },
          'user-role': {
            url: 'https://api.redoxengine.com/extensions/user-role',
            coding: {
              code: '112247003',
              display: 'Medical Doctor',
            },
          },
          'purpose-of-use': {
            url: 'https://api.redoxengine.com/extensions/purpose-of-use',
            coding: {
              code: 'TREATMENT',
              display: 'Treatment',
            },
          },
        },
        DataModel: 'PatientSearch',
        EventType: 'LocationQuery',
        Test: true,
        Destinations: [
          {
            // prod.dev: adf917b5-1496-4241-87e2-ed20434b1fdb
            // 10x:
            // "ID": "eb6827c3-c3c0-4fbc-8952-c802203374ca"
            ID: 'adf917b5-1496-4241-87e2-ed20434b1fdb',
          },
        ],
      },
      Patient: {
        Identifiers: [
          {
            // These will always change based on the previous search response. This only ever expects one identifier at this time
            IDType: req.redoxPatientIdType,
            ID: req.redoxPatientId,
          },
        ],
      },
    },
    {
      headers: {
        Authorization: `Bearer ${tokenInfo.accessToken}`,
      },
    }
  );

  // Find the task-status for this to see if we need to query again
  const taskStatus: 'Active' | 'Success' | 'Error' = get(
    res.data,
    'Meta.Extensions.task-status.string',
    'Error'
  );
  if (taskStatus === 'Success') {
    // All done
    return res.data;
  }
  if (taskStatus === 'Error') {
    // Internal error that we need to handle better in the future
    throw new Error('Redox error when running the location search task');
  }
  // Try again
  return makePatientLocationSearch(req);
};

export interface ClinicalDocumentQueryRequest {
  patientId: string;
  patientIdType: string;
  facilityCode: string;
}

export interface ClinicalDocumentQueryResponse {
  Meta: {
    DataModel: 'Clinical Summary';
    EventType: 'DocumentQuery';
    Logs: Array<{
      ID: string;
      AttemptID: string;
    }>;
  };
  Documents: Array<{
    Type: {
      Code: string;
    };
    ID: string;
    Visit: {
      EndDateTime: string;
    };
  }>;
  Patient: {
    Identifiers: Array<{
      ID: string;
      IDType: string;
    }>;
  };
}

export const makeSummaryDocumentQuery = async (
  req: ClinicalDocumentQueryRequest
): Promise<ClinicalDocumentQueryResponse> => {
  if (!tokenInfo.accessToken) {
    const accessToken = await getAccessToken();
    tokenInfo.accessToken = accessToken;
  }
  console.log('making CS DocumentQuery search', tokenInfo.accessToken);
  console.log('req from that', req);
  const res = await httpClient.post<
    Record<string, unknown>,
    AxiosResponse<ClinicalDocumentQueryResponse>
  >(
    'https://cors-anywhere.herokuapp.com/https://api.redoxengine.com/endpoint',
    {
      Meta: {
        DataModel: 'Clinical Summary',
        EventType: 'DocumentQuery',
        Test: true,
        Destinations: [
          {
            // Same as before (only changes between sandbox and prod), just a different routing destination within Redox for documents
            // Production value: 628cbf79-1156-4923-b9d0-285906160ed6
            ID: 'ec745338-8849-43ad-a7ce-4bc5bf1d8b89',
          },
        ],
        // Changes based on what Organization from the location you're searching on. From previous result:
        // e.g. json.Patients[i].Organization.Identifiers[0].ID
        FacilityCode: req.facilityCode,
        Extensions: {
          // Typically static as before unless you need more structure built out
          // Everything else is the same
          'sender-organization-id': {
            string: '2.16.840.1.113883.3.6147.458.5420.1.1.2',
          },
          'user-id': {
            string: 'Doolittle, John',
          },
          'user-role': {
            coding: {
              code: '112247003',
              display: 'Medical Doctor',
            },
          },
          'purpose-of-use': {
            coding: {
              code: 'TREATMENT',
            },
          },
        },
      },

      Patient: {
        Identifiers: [
          {
            // Values from location search response
            // e.g. json.Patients[i].Identifiers.find(idObject => idObject.IDType === json.Patients[i].Organization.Identifiers[0].ID)
            ID: req.patientId,
            IDType: req.patientIdType,
          },
        ],
      },
    },
    {
      headers: {
        Authorization: `Bearer ${tokenInfo.accessToken}`,
      },
    }
  );

  return res.data;
};

export interface ClinicalDocumentGetRequest {
  documentId: string;
  facilityCode: string;
}

export interface ClinicalDocumentGetResponse {
  Meta: {
    DataModel: 'Clinical Summary';
    EventType: 'DocumentGet';
    Logs: Array<{
      ID: string;
      AttemptID: string;
    }>;
  };
  Data: string;
}

export const makeSummaryDocumentGet = async (
  req: ClinicalDocumentGetRequest
): Promise<ClinicalDocumentGetResponse> => {
  if (!tokenInfo.accessToken) {
    const accessToken = await getAccessToken();
    tokenInfo.accessToken = accessToken;
  }
  console.log('making CS DocumentGet search', tokenInfo.accessToken);
  const res = await httpClient.post<
    Record<string, unknown>,
    AxiosResponse<ClinicalDocumentGetResponse>
  >(
    'https://cors-anywhere.herokuapp.com/https://api.redoxengine.com/endpoint',
    {
      Meta: {
        DataModel: 'Clinical Summary',
        EventType: 'DocumentGet',
        Test: true,
        Destinations: [
          {
            ID: 'ec745338-8849-43ad-a7ce-4bc5bf1d8b89',
          },
        ],
        FacilityCode: req.facilityCode,
        Extensions: {
          'sender-organization-id': {
            string: '2.16.840.1.113883.3.6147.458.5420.1.1.2',
          },
          'user-id': {
            string: 'Doolittle, John',
          },
          'user-role': {
            coding: {
              code: '112247003',
              display: 'Medical Doctor',
            },
          },
          'purpose-of-use': {
            coding: {
              code: 'TREATMENT',
            },
          },
        },
      },
      Document: {
        ID: req.documentId,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${tokenInfo.accessToken}`,
      },
    }
  );

  console.log('res', res);
  return res.data;
};
