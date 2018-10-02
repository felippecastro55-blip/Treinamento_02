//Lista contendo objetos de configurações de campo
 Ex: [
{
	state: {type: 'default', num: null}, //type: LISTA DE ESTADO DO FORMULARIO (EX: ['VIEW']). DEFAULT = [MOD, ADD] || NUM = LISTA DE ATIVIDADES QUE TAL CONFIGURAÇÃO VAI AGIR. (EX: [1, 2]). NULL = TODAS 
	name: 'DATAENTRADA', //NOME DO CAMPO
	fieldType: 'date', //TIPO DE CAMPO DATA
	class: [],
	required: true, 
	requiredConfig: {type: 'default', config: null}, //DEFAULT = OBRIGATORIO QUANDO VISIVEL || CUSTOM = OBRIGATORIEDADE CUSTOMIZADA (Ex: { depends: function(el) { return $(el).is(":visible"); && $('[name="CMAPOEXEMPLO"]').val() != '' }, },)
	fieldOptions: {
		minDate: moment()
	}
},
{
	state: {type: 'default', num: null}, //type: LISTA DE ESTADO DO FORMULARIO (EX: ['VIEW']). DEFAULT = [MOD, ADD] || NUM = LISTA DE ATIVIDADES QUE TAL CONFIGURAÇÃO VAI AGIR. (EX: [1, 2]). NULL = TODAS 
	name: 'VALORENTRADA', //NOME DO CAMPO
	fieldType: 'money', //TIPO DE CAMPO monetario
	required: true, 
	requiredConfig: {type: 'default', config: null}, //DEFAULT = OBRIGATORIO QUANDO VISIVEL || CUSTOM = OBRIGATORIEDADE CUSTOMIZADA (Ex: { depends: function(el) { return $(el).is(":visible"); && $('[name="CMAPOEXEMPLO"]').val() != '' }, },)
	fieldOptions: {
		prefix: 'R$ ', 
		thousands: '', 
		decimal: ','
	}
},
{
	state: {type: 'default', num: [3,5,9]}, 
	fieldType: 'aprovacao', //TIPO DE CAMPO APROVACAO
	name: 'FINANCEIRO', //STRING CHAVE PARA INICIAR APROVACAO
},
{
	state: {type: 'default', num: [3,5,9]}, 
	fieldType: 'zoom', //TIPO DE CAMPO APROVACAO
	name: 'COLIGADA', //STRING CHAVE PARA INICIAR APROVACAO
	required: true, 
	requiredConfig: {type: 'default', config: null},
	zoomOptions: {
		label: 'Coligada',
        uFZommType: '2',	// 1=DataServer | 2=Consulta | 3=Dataset | 4=query 
        CodQuery: 'FLUIG.0027', // dataserver | codsentenca | nome_dataset | array
        constraints:[],
        columns: [
            { title: 'Código', data: 'CODCOLIGADA', className: 'text-nowrap' },
            { title: 'Nome', data: 'NOMEFANTASIA' },
        ],
    },
    zoomReturn: {
    	//DEFAULT = RETORNO DO DATASET DIRETO PARA CAMPOS DO FORM
    	//1 = UTILIZA 'DE PARA' do fields
    	//2 = UTILIZA 'FUNÇÃO' do fields
    	type: '1', 
    	fields: [
    		{
    			data: 'COLIGADA',
    			formField: 'COLIGADA'
    		},
    		{
    			data: 'CODCOLIGADA',
    			formField: 'COLIGADACOD'
    		},
    	]
    	
    }
}];
var fieldsConfig = [];


//Lista contendo objeto de sections
Ex: [{
	id: 'secTabela',
	visible: false, //TRUE = SEMPRE VISIVEL || FALSE = VISIVEL APENAS NAS ATIVIDADES CONTIDAS EM VISIBLEATV
	visibleAtv: [2, 3, 4, 5], //LISTA DE ATIVIDADES QUE ESSA SECTION É VISIVEL
	enabled: true, //TRUE = TAL SECTION É ENABLED EM ALGUMA ATIVIDADE || FALSE = SEMPRE DISABLED
	enabledAtv: [2] //LISTA DE ATIVIDADES QUE ESSA SECTION NÃO ESTÁ DISABLED
},
{
	id: 'secCabecalho',
	visible: true, //TRUE = SEMPRE VISIVEL
	enable: false, //FALSE = SEMPRE DISABLED
}]

var sectionsConfig = [];

uFFw.init(modForm, numState,fieldsConfig, sectionsConfig);