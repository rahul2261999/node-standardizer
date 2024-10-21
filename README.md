# node-standardizer
Utilities method focused on best practices and scalable solutions

Sample data to test the validator

Note: import validator from the validator.ts file

const sampleObject = {
  name: "John Doe",           // String
  age: 28,                    // Number
  email: "john.doe@example.com", // String
  isActive: true,             // Boolean
  address: {                  // Nested Object
    street: "123 Main St",    // String
    city: "New York",         // String
    zipCode: "10001"          // String
  },
  phoneNumbers: [             // Array of Strings
    "+1-555-555-5555",
    "+1-555-555-5556"
  ],
  preferences: {              // Nested Object
    notifications: {          // Nested Object
      email: true,            // Boolean
      sms: false,             // Boolean
      push: null              // Boolean
    }
  },
  tags: ["premium", "vip"],   // Array of Strings
  metadata: {                 // Nested Object with mixed data types
    lastLogin: "2024-10-19T12:34:56Z", // String (ISO date)
    loginAttempts: 5,         // Number
    history: [                // Array of Objects
      {
        date: "2024-09-15T10:20:30Z", // String (ISO date)
        action: "login"
      },
      {
        date: "2024-09-16T11:25:35Z", // String (ISO date)
        action: "logout"
      }
    ]
  },
  customData: [               // Array with mixed data types
    { key: "height", param: 180 },    // Object (key-param pair)
    { key: "weight", param: 75 }
  ],
  preferencesArray: [         // Array of objects
    {
      setting: "darkMode",    // String
      enabled: true           // Boolean
    },
    {
      setting: "autoSave",    // String
      enabled: false          // Boolean
    }
  ],
  nestedArray: [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    []
  ]
};

const sampleArray : [ 'height', 'weight'];
const sampleNestedArray : [ ['a', 'b', 'c'], ['e', 'f', 'g']]