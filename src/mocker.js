
import { ApolloLink, Observable } from 'apollo-link';

/*

mockLinkConfig = {
  links,

  // Switch between mock and real with a flick :)
  enableMock: true,

  // You can mock few of queries/mutations too
  targetOperations: ['getCompanyName', 'getCompanyEmployees'],

  // All the mock data for various queries
  mockData: {
    'getCompanyName': {data: {name: 'Test', __typename: 'String'}, error: null},
    'getCompanyEmployees': {data: {employees: ['TestUser'], __typename: 'Employee'}, error: null},
    'getCompanyId': {data: {id: '123', __typename: 'CompanyID'}, error: null},
    ...
  }
}

*/
export class MockLink extends ApolloLink {
  constructor(mockLinkConfig) {
    super();
    this.config = mockLinkConfig;
  }

  request(operation, forward) {
    const { enableMock, targetOperations } = this.config;
    const isOperationMocked = targetOperations.find(
      (query) => query === operation.operationName
    );
    if (enableMock && isOperationMocked) {
      return new Observable((observer) => {
        console.log("In Mock Link ...");
        setTimeout(() => {
          const relatedMockdata = this.config.mockData[operation.operationName];
          observer.next(relatedMockdata);
          observer.complete();
        }, 2000);
      });
    }
    return forward(operation);
  }
}

/**
 * links - links array used for ApolloClient
 * enableMock - enable or disable mocking flag
 * targetOperations - list of operations to target
 * mockData - data config for success / error responses
 * createCustomLinkObj - to create link object as per user's links structure
 */
export const injectMock = ({ links, enableMock = true, targetOperations, mockData, createCustomLinkObj }) => {
  const mockLink = new MockLink({
    enableMock,
    mockData,
    targetOperations
  });

  const mockLinkObj = createCustomLinkObj ? createCustomLinkObj(mockLink) : {
    name: 'mockHttp',
    link: mockLink
  };

  links.splice(links.length - 1, 0, mockLinkObj);
}