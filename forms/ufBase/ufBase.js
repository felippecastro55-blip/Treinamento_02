
// variáreis declaradas no evento displayFields.js do Formulário verifica se elas existem, se não, define valores padrão
if (typeof infoWorkflow      == 'undefined')     infoWorkflow       = {};       // objeto com informações do workflow
if (typeof modForm           == 'undefined')     modForm            = 'ADD';    // modo do formulário

$(document).ready(function() {
	WKNumState = ((typeof infoWorkflow.WKNumState != 'undefined')?Number(infoWorkflow.WKNumState):0);


	//Lista contendo objetos de configurações de campo
	var fieldsConfig = [
	{
		name: 'DATAEXEMPLO', //NOME DO CAMPO
		state: {type: ['MOD'], num: [0, 1]}, //type: LISTA DE ESTADO DO FORMULARIO (EX: ['VIEW']). DEFAULT = [MOD, ADD] || NUM = LISTA DE ATIVIDADES QUE TAL CONFIGURAÇÃO VAI AGIR. (EX: [1, 2]). NULL = TODAS 

		fieldType: 'date', //TIPO DE CAMPO DATA
		validate: ['required'], 
		fieldOptions: {
			maxDate: moment(),
			useCurrent: false
		},
		customActions: function( $self ) { //função para customização
			
			$self.parent().find('.iconData').on('click', function(){
				
				$self.trigger('click').focus();
				
			})
		
		}
	},
	{
		state: {type: 'default', num: [0, 1]}, //type: LISTA DE ESTADO DO FORMULARIO (EX: ['VIEW']). DEFAULT = [MOD, ADD] || NUM = LISTA DE ATIVIDADES QUE TAL CONFIGURAÇÃO VAI AGIR. (EX: [1, 2]). NULL = TODAS 
		name: 'SELECTTESTE', //NOME DO CAMPO
		class: ['text-right'],
		validate: [], 
		requiredConfig: { depends: function(el) { return $(el).is(":visible") && $('[name="DATAEXEMPLO"]').val() != '' }, },
		customActions: function( $self ) { //função para customização
			console.log('Teste Execução Custom')
			console.log($self)

		}
	},
	{
		state: {type: 'default', num: [0, 1]}, //type: LISTA DE ESTADO DO FORMULARIO (EX: ['VIEW']). DEFAULT = [MOD, ADD] || NUM = LISTA DE ATIVIDADES QUE TAL CONFIGURAÇÃO VAI AGIR. (EX: [1, 2]). NULL = TODAS 
		name: 'MONETARIOEXEMPLO', //NOME DO CAMPO
		class: ['text-right'],
		fieldType: 'money', //TIPO DE CAMPO monetario
		validate: ['required'], 
		requiredConfig: { depends: function(el) { return $(el).is(":visible") && $('[name="DATAEXEMPLO"]').val() != '' }, },
		fieldOptions: {
			prefix: 'R$ ', 
			thousands: '', 
			decimal: ','
		}
	},
	{
		state: {type: 'default', num: [2]}, 
		fieldType: 'aprovacao', //TIPO DE CAMPO APROVACAO
		name: 'FINANCEIRO', //STRING CHAVE PARA INICIAR APROVACAO
	},
	{
		state: {type: 'default', num: [0, 1]}, 
		fieldType: 'zoom', //TIPO DE CAMPO APROVACAO
		name: 'COLIGADA', //STRING CHAVE PARA INICIAR APROVACAO
		validate: [], 
		zoomOptions: {
			label: 'Coligada',
	        uFZommType: '2',	// 1=DataServer | 2=Consulta | 3=Dataset | 4=query 
	        CodQuery: 'FLUIG.EXEMPLO', // dataserver | codsentenca | nome_dataset | array
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
	    			data: 'NOMEFANTASIA',
	    			formField: 'COLIGADA'
	    		},
	    		{
	    			data: 'NOMEFANTASIA',
	    			formField: 'COLIGADACOD'
	    		},
	    	]
	    	
	    }
	}
	];

	//Lista contendo objeto de sections
	var sectionsConfig = [
		
		
		{
			id: 'secRequisicao',
			visible: false, //TRUE = SEMPRE VISIVEL || FALSE = VISIVEL APENAS NAS ATIVIDADES CONTIDAS EM VISIBLEATV
			visibleAtv: [0, 1], //LISTA DE ATIVIDADES QUE ESSA SECTION É VISIVEL
			enabled: true, //TRUE = TAL SECTION É ENABLED EM ALGUMA ATIVIDADE || FALSE = SEMPRE DISABLED
			enabledAtv: [0, 1] //LISTA DE ATIVIDADES QUE ESSA SECTION NÃO ESTÁ DISABLED
		},
		{
			id: 'secAprovacaoFINANCEIRO',
			visible: false, //TRUE = SEMPRE VISIVEL || FALSE = VISIVEL APENAS NAS ATIVIDADES CONTIDAS EM VISIBLEATV
			visibleAtv: [2, 4], //LISTA DE ATIVIDADES QUE ESSA SECTION É VISIVEL
			enabled: true, //TRUE = TAL SECTION É ENABLED EM ALGUMA ATIVIDADE || FALSE = SEMPRE DISABLED
			enabledAtv: [2] //LISTA DE ATIVIDADES QUE ESSA SECTION NÃO ESTÁ DISABLED
		},
		{
			id: 'secDependentes',
			visible: false, //TRUE = SEMPRE VISIVEL || FALSE = VISIVEL APENAS NAS ATIVIDADES CONTIDAS EM VISIBLEATV
			visibleAtv: [0, 1], //LISTA DE ATIVIDADES QUE ESSA SECTION É VISIVEL
			enabled: true, //TRUE = TAL SECTION É ENABLED EM ALGUMA ATIVIDADE || FALSE = SEMPRE DISABLED
			enabledAtv: [0, 1] //LISTA DE ATIVIDADES QUE ESSA SECTION NÃO ESTÁ DISABLED
		},
		
	];

	//Lista contendo objeto de tables
	var tablesConfig =  [
		{
			state: {type: 'default', num: [0, 1]},
			id: 'tblDependentes',
			fields: [
			{
				state: {type: 'default', num: [0, 1]}, //type: LISTA DE ESTADO DO FORMULARIO (EX: ['VIEW']). DEFAULT = [MOD, ADD] || NUM = LISTA DE ATIVIDADES QUE TAL CONFIGURAÇÃO VAI AGIR. (EX: [1, 2]). NULL = TODAS 
				name: 'DATAEXEMPLOTABLE', //NOME DO CAMPO
				fieldType: 'date', //TIPO DE CAMPO DATA
				validate: [], 
				fieldOptions: {
					minDate: moment(),
					useCurrent: false
				},
				customActions: function( $self ) { //função para customização
					console.log('Teste Execução Custom')
					console.log($self)
		
				}
			},
			{
				state: {type: 'default', num: [0, 1]}, //type: LISTA DE ESTADO DO FORMULARIO (EX: ['VIEW']). DEFAULT = [MOD, ADD] || NUM = LISTA DE ATIVIDADES QUE TAL CONFIGURAÇÃO VAI AGIR. (EX: [1, 2]). NULL = TODAS 
				name: 'MONETARIOEXEMPLOTABLE', //NOME DO CAMPO
				class: ['text-right'],
				fieldType: 'money', //TIPO DE CAMPO monetario
				validate: [], 
				requiredConfig: { depends: function(el) { return $(el).is(":visible") && $('[name="DATAEXEMPLO"]').val() != '' }, },
				fieldOptions: {
					prefix: 'R$ ', 
					thousands: '', 
					decimal: ','
				}
			},
			{
				state: {type: 'default', num: [0, 1]}, 
				fieldType: 'zoom', //TIPO DE CAMPO APROVACAO
				name: 'COLIGADATABLE', //STRING CHAVE PARA INICIAR APROVACAO
				validate: [], 
				zoomOptions: {
					label: 'Coligada',
			        uFZommType: '2',	// 1=DataServer | 2=Consulta | 3=Dataset | 4=query 
			        CodQuery: 'FLUIG.EXEMPLO', // dataserver | codsentenca | nome_dataset | array
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
			    			data: 'NOMEFANTASIA',
			    			formField: 'COLIGADATABLE'
			    		},
			    		{
			    			data: 'CODCOLIGADA',
			    			formField: 'COLIGADACODTABLE'
			    		},
			    	]
			    	
			    }
			}
			],
			// Função que executa antes de deletar um ITEM da tabela.
			beforeRemoveCallback: function($self){
				console.info('Rodou antes de excluir a linha: ', $self)
			},
			// Função que executa após deletar um ITEM da tabela  OBS: Não retorna o $self pois a linha já foi excluida.
			afterRemoveCallback: function(){
				console.info('Rodou após excluir a linha.')
			},
			// Função que executa após adicionar um ITEM da tabela.
			afterAddLine: function($self){
				console.info('Rodou após adicionar uma linha.')
			}
	}];
	
	
	var customActionsConfig = [
		{
			state: {type: 'default', num: [0, 1, 2]}, 
			customActions: function( ) {//função para customização7
				
				console.log('testando custom action')
			}
		}
	];
	
	//função para determinar qual será a configuração padrao do validate dentro do framework
	uFFw.setDefaults('validOptions', { depends: function(el) { return true }, })
	
	//inicia o framework
	uFFw.init(modForm, WKNumState, fieldsConfig, sectionsConfig, tablesConfig, customActionsConfig);
    
	
});


/**
* Função padrão do Fluig. É executada quando o usuário pressiona o botão Movimentar
* antes de serem exibidas as opções de movimentação do processo.
* ## Se o fluxo não necessitar da interação do usuário, este método não será executado!  
* return false: impedirá a execução do processo. Esta opção permite que sejam exibidos erros personalizados no formulário.
* throw(“Erro”): impedirá a execução e exibirá uma tela de erro padrão do fluig com o texto informado.
* @param numState - número da atividade atual
*/
var beforeMovementOptions = function(numState){
    console.info('VALIDAÇÃO', 'Atividade:', numState);
    
	if ( !$validator.form() ) throw 'Não será possível enviar os dados pois há campos com erro.</br>Por favor, verifique os campos destacados de vermelho.</br>'+uFFw.utils.listaErros();
    
};

/**
 * Função padrão do Fluig. Ocorre antes da solicitação ser movimentada, após já ter sido
 * selecionada a atividade destino, o usuário e demais informações necessárias à solicitação.
 * @param numState - número da atividade atual
 * @param nextState - número da atividade destino
 */
var beforeSendValidate = function (numState, nextState) {
    console.info('CONFIRMAÇÃO', 'De:', numState, 'Para:', nextState);
	    
	// verifica a validação do formulário
	if ( !$validator.form() ) {
		
		parent.FLUIGC.message.alert({
			message: 'Não será possível enviar os dados pois há campos com erro.</br>Por favor, verifique os campos destacados de vermelho.</br>'+listaErros(),
			title: 'Formulário não validado',
			label: 'OK'
		});
	
		return false;
	}
    
};