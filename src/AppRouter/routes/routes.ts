import { param, route } from './types';

/*
 * This is where all routes for the app are created. You should never pass a
 * raw string in the app, but instead always reference a route created here
 * or from the sibling ./templates.ts file.
 *
 * The routes created here are type safe in that the shape of their params are
 * validated at compile time.
 *
 * Arguments to `route` are each path item i.e. what would normally be separated by
 * a slash. Params should not be declared inline but instead grouped together below.
 *
 * Examples:
 *
 * ❌ route('signup/verification/failure')
 * => path items should be separate arguments
 * ✅ route('signup', 'verification', 'failure')
 *
 * ❌ route('signup', 'verification', param('token')),
 * => params should not be declared inline
 * ✅ route('signup', 'verification', token),
 */

const apiTraceId = param('apiTraceId');
const patientId = param('patientId');
const orgId = param('orgId');

export const routes = {
  notFound: route('404'),
  login: {
    root: route('auth', 'login'),
  },
  logout: route('auth', 'logout'),
  admin: {
    root: route('admin'),
    api: {
      root: route('admin', 'api'),
      one: route('admin', 'api', apiTraceId),
    },
    user: {
      root: route('user'),
    },
  },
  patient: {
    root: route('patient', 'search'),
    list: route('patient', 'list'),
    search: route('patient', 'search'),
    one: {
      root: route('patient', patientId),
      reconciliation: route('patient', patientId, 'reconcile'),
    },
  },
  organization: {
    root: route('organization'),
    search: route('organization', 'search'),
    patient: {
      root: route('organization', orgId, 'patient', 'search'),
    },
  },
};
