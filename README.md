## OpenAPI-Mock-Server-Codegen
An OpenAPI mock server code generation tool.With this tool, you can directly generate a server supported by the koa (currently supported) framework through swagger.json/swagger.yaml
### Install
```
npm install -g openapi-mock-server-codegen
```
### Getting started
You can execute commands directly in the CMD environment
```
mock codegen -td D:\templates -cd D:\server
```
##### Command Parameters  
| parameter name | info |
| :---: | :--- |
| -td, --templateDir | Template files dir. You can place multiple swagger files in this directory |
| -cd, --codeDir | The server code generation directory |
| --api | the path of OpenAPI definition file |

### Server usage  
#### Start server
Execute the following command in the root directory of the generated code
```javascript
node index.js
```
#### Server config
config.json file in the code root directory
| item | info |
| :---: | :--- |
| port | Port number used by koa, default: 3020 |
| randomResp | Whether to randomly generate the response defined in the `response` field,  default: true |
| useDict | Whether to use a dictionary to tell the faker framework what kind of data this field needs to generate, default: true |
| locale | The localized language currently used by faker, default: "en_US" |
