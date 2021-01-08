const express = require('express');
const axios = require('axios');
const morgan = require('morgan');
const qs = require('querystring');
const ord = require('locutus/php/strings/ord');
const dechex = require('locutus/php/math/dechex');
const number_format = require('locutus/php/strings/number_format');
const app = express();

//Middlewares
app.use(morgan('tiny'));

app.use((req, res, next) => {
	//Qual site tem permissão de realizar a conexão, no exemplo abaixo está o "*" indicando que qualquer site pode fazer a conexão
    res.header("Access-Control-Allow-Origin", "*");
	//Quais são os métodos que a conexão pode realizar na API
    res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
    app.use(cors());
    next();
});

app.use(express.json());

app.use('/',express.static('apidoc'))

//Consts and vars
const ID_PAYLOAD_FORMAT_INDICATOR = '00';
const ID_MERCHANT_ACCOUNT_INFORMATION = '26';
const ID_MERCHANT_ACCOUNT_INFORMATION_GUI = '00';
const ID_MERCHANT_ACCOUNT_INFORMATION_KEY = '01';
const ID_MERCHANT_ACCOUNT_INFORMATION_DESCRIPTION = '02';
const ID_MERCHANT_CATEGORY_CODE = '52';
const ID_TRANSACTION_CURRENCY = '53';
const ID_TRANSACTION_AMOUNT = '54';
const ID_COUNTRY_CODE = '58';
const ID_MERCHANT_NAME = '59';
const ID_MERCHANT_CITY = '60';
const ID_ADDITIONAL_DATA_FIELD_TEMPLATE = '62';
const ID_ADDITIONAL_DATA_FIELD_TEMPLATE_TXID = '05';
const ID_CRC16 = '63';

const pixKey= '70048318418';
let description = 'Pagamento';
const merchantName = 'Daniel Cabral de Souza';
const merchantCity = 'Açu';
let txid = '2121';
let amount = 100.00;
amount = number_format(amount, 2, '.', '');

/**
   * Metodo responsavel por retornar o valor completo do objeto payload
   * @param string id
   * * @param string value
   * * @return string id.size.value
   */
  function getValue(id, value){
    const size = (''+value.length).padStart(2, '0');    
    return id+size+value;
   }

    /**
   * Metodo responsavel por retornar os valores complestos de informação da conta
   * @return string
   */
   function getMerchantAccountInformation(){
     //Dominio do banco
     const gui = getValue(ID_MERCHANT_ACCOUNT_INFORMATION_GUI, 'br.gov.bcb.pix');

     //Chave Pix
     const key =getValue(ID_MERCHANT_ACCOUNT_INFORMATION_KEY, pixKey);

     //Descrição do pagamento
     description = description.length?  getValue(ID_MERCHANT_ACCOUNT_INFORMATION_DESCRIPTION, description) : '';

     //Valor completo da conta
     return  getValue(ID_MERCHANT_ACCOUNT_INFORMATION, gui+key+description);
   }

   /**
   * Metodo responsavel por retornar os valores completos do campo adicional (txid)
   * @return string
   */
    function getAdditionalDataFieldTemplate(){
     //TXID
     txid =  getValue(ID_ADDITIONAL_DATA_FIELD_TEMPLATE_TXID,  txid);

     //Retorna o valor completo
     return  getValue(ID_ADDITIONAL_DATA_FIELD_TEMPLATE, txid);
   }

 function getCRC16(payload) {
  //ADICIONA DADOS GERAIS NO PAYLOAD
  payload += ID_CRC16+'04';

  //DADOS DEFINIDOS PELO BACEN
  const polinomio = 0x1021;
  let resultado = 0xFFFF;
  //CHECKSUM
  let length = payload.length;
  if (length > 0) {
      for (let offset = 0; offset < length; offset++) {
          resultado ^=(ord(payload[offset]) << 8);
          for (let bitwise = 0; bitwise < 8; bitwise++) {
              if ((resultado <<= 1) & 0x10000) resultado ^= polinomio;
              resultado &= 0xFFFF;
          }
      }
  }
  
  //RETORNA CÓDIGO CRC16 DE 4 CARACTERES
  return ID_CRC16+'04'+dechex(resultado).toUpperCase();
}

function getPayload() {
  //Cria o payload  
  payload =  getValue(ID_PAYLOAD_FORMAT_INDICATOR, '01')+
  getMerchantAccountInformation()+
   getValue(ID_MERCHANT_CATEGORY_CODE, '0000')+
   getValue(ID_TRANSACTION_CURRENCY, '986')+
   getValue(ID_TRANSACTION_AMOUNT,  amount)+
   getValue(ID_MERCHANT_NAME,  merchantName)+
   getValue(ID_MERCHANT_CITY,merchantCity)+
   getAdditionalDataFieldTemplate();

  //Retorna o payload + CRC16 
  return payload+getCRC16(payload);
}

async function getToken(){
    const endpoint = 'https://oauth.hm.bb.com.br/oauth/token/';

    

    const request= {
        grant_type : "client_credentials",
        scope : 'cob.read cob.write pix.read'
    };
    const headers = {
      'Authorization':'Basic ZXlKcFpDSTZJamczTVdFMk5EVXRJaXdpWTI5a2FXZHZVSFZpYkdsallXUnZjaUk2TUN3aVkyOWthV2R2VTI5bWRIZGhjbVVpT2pFeU16ZzBMQ0p6WlhGMVpXNWphV0ZzU1c1emRHRnNZV05oYnlJNk1YMDpleUpwWkNJNkltUmpPR0l5T1RrdE1XVmhaUzAwTVRCakxUa3lPRFV0TXpRMElpd2lZMjlrYVdkdlVIVmliR2xqWVdSdmNpSTZNQ3dpWTI5a2FXZHZVMjltZEhkaGNtVWlPakV5TXpnMExDSnpaWEYxWlc1amFXRnNTVzV6ZEdGc1lXTmhieUk2TVN3aWMyVnhkV1Z1WTJsaGJFTnlaV1JsYm1OcFlXd2lPakVzSW1GdFltbGxiblJsSWpvaWFHOXRiMnh2WjJGallXOGlMQ0pwWVhRaU9qRTJNRGsyTXpnNU16WXhPVFY5', 
      //'Content-Type': 'application/json',
      'Content-Type':' application/x-www-form-urlencoded',
    };

  const response = await axios.post(endpoint, qs.stringify(request),{headers:headers})
  .catch(err => console.log(err))
  ;	
  return response.data.access_token;
}


app.post('/', async function(req, res){
  req
});


app.post('/', async function(req, res){
  
  console.log(getPayload());
  /*const acess_token = await getToken();
    const txid='21212121212121212121212121212123'
    const endpoint = `https://api.hm.bb.com.br/pix/v1/cob/{txid}?gw-dev-app-key=d27bb77900ffab901361e17da0050b56b9d1a5bf`;
    const headers = {
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + acess_token,
    };
    const request = {
        calendario : {
          expiracao : "3600",
        },
        devedor: {
          cpf: "12345678909",
          nome: "Francisco da Silva"
        },
        valor: {
          original: "123.45"
        },
        chave: "testqrcode01@bb.com.br",
        solicitacaoPagador: "Cobrança dos serviços prestados."
    };

    const response = await axios.put(endpoint, request,{headers:headers})
    .then((result) => {
     	console.log(result);
        res.send(result.data);
	})
	.catch(err => console.log(err))
    ;
    */
});



app.listen(3333);
