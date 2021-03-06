define({ "api": [
  {
    "type": "post",
    "url": "/payload/",
    "title": "Get payload information",
    "name": "Get_Payload",
    "group": "QrCode",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "pixKey",
            "description": "<p>Key pix of merchant.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>Description of payment.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "merchantName",
            "description": "<p>Name of merchant.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "txid",
            "description": "<p>Id of the transaction.</p>"
          },
          {
            "group": "Parameter",
            "type": "Float",
            "optional": false,
            "field": "amount",
            "description": "<p>Value of the transaction.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>Token autorizathion of the User.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "payload",
            "description": "<p>Payload complet.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"pixKey\": \"70048318418\",\n  \"description\": \"Payment\",\n  \"merchantName\": \"Daniel Cabral de Souza\",\n  \"merchantCity\": \"Natal\",\n  \"txid\": \"2121\",\n  \"amount\": 100.00\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Payload",
            "description": "<p>error data.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Error\n{\n  \"error\": \"Payload dont cant be generated\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/server.js",
    "groupTitle": "QrCode"
  }
] });
