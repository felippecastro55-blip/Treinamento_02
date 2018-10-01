//Lista contendo objetos de configurações de campo
 Ex: [{
	state: {type: 'default', num: null}, //type: LISTA DE ESTADO DO FORMULARIO (EX: ['VIEW']). DEFAULT = [MOD, ADD] || NUM = LISTA DE ATIVIDADES QUE TAL CONFIGURAÇÃO VAI AGIR. (EX: [1, 2]). NULL = TODAS 
	name: 'DATAENTRADA', //NOME DO CAMPO
	class: [], //lista de classe a ser adicionada no campo
	fieldType: 'date', //TIPO DE CAMPO DATA
	required: true, 
	requiredConfig: {type: 'default', config: null}, //DEFAULT = OBRIGATORIO QUANDO VISIVEL || CUSTOM = OBRIGATORIEDADE CUSTOMIZADA (Ex: { depends: function(el) { return $(el).is(":visible"); && $('[name="CMAPOEXEMPLO"]').val() != '' }, },)
	fieldConfig: {
		minDate: moment()
	}
},
{
	state: {type: 'default', num: [3,5,9]}, 
	fieldType: 'aprovacao', //TIPO DE CAMPO APROVACAO
	name: 'FINANCEIRO', //STRING CHAVE PARA INICIAR APROVACAO
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

uFFw.init(numState, form,fieldsConfig, sectionsConfig);