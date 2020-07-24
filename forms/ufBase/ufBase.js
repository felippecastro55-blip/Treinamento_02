
// variáreis declaradas no evento displayFields.js do Formulário verifica se elas existem, se não, define valores padrão
if (typeof infoWorkflow      == 'undefined')     infoWorkflow       = {};       // objeto com informações do workflow
if (typeof modForm           == 'undefined')     modForm            = 'ADD';    // modo do formulário

$(document).ready(function() {
	WKNumState = ((typeof infoWorkflow.WKNumState != 'undefined')?Number(infoWorkflow.WKNumState):0);


	//Lista contendo objetos de configurações de campo
	var fieldsConfig = [
	{
		name: 'DATAEXEMPLO', //NOME DO CAMPO
		state: {type: 'default', num: [0, 1]}, //type: LISTA DE ESTADO DO FORMULARIO (EX: ['VIEW']). DEFAULT = [MOD, ADD] || NUM = LISTA DE ATIVIDADES QUE TAL CONFIGURAÇÃO VAI AGIR. (EX: [1, 2]). "all" = TODAS 

		fieldType: 'date', //TIPO DE CAMPO DATA
		validate: ['required'],
		validationCascade: {
			eventToValidate: 'change',
			fieldsToValidate: [
				'MONETARIOEXEMPLO',
			]
		},
		successValidation: function ( $self ) {
			console.log(`${$self.attr('name')} validado`)
		},
		errorValidation: function ( $self ) {
			console.log(`${$self.attr('name')} NÂO validado`)
		},

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
		state: {type: 'default', num: "all"}, //type: LISTA DE ESTADO DO FORMULARIO (EX: ['VIEW']). DEFAULT = [MOD, ADD] || NUM = LISTA DE ATIVIDADES QUE TAL CONFIGURAÇÃO VAI AGIR. (EX: [1, 2]). "all" = TODAS 
		name: 'MONETARIOEXEMPLO', //NOME DO CAMPO
		class: ['text-right'],
		fieldType: 'money', //TIPO DE CAMPO monetario
		validate: ['required'],
		validationCascade: {
			fieldsToValidate: [
				'COLIGADA',
			]
		},
		requiredConfig: { depends: function(el) { return $(el).is(":visible") && $('[name="DATAEXEMPLO"]').val() != '' }, },
		successValidation: function ( $self ) {
			console.log(`${$self.attr('name')} validado`)
		},
		errorValidation: function ( $self ) {
			console.log(`${$self.attr('name')} NÂO validado`)
		},
		fieldOptions: {
			prefix: 'R$ ', 
			thousands: '', 
			decimal: ','
		},
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
		validate: ['required'],
		validationCascade: {
			eventToValidate: 'click',
		},
		requiredConfig: { depends: function(el) { return $(el).is(":visible") && $('[name="DATAEXEMPLO"]').val() != '' }, },
		successValidation: function ( $self ) {
			console.log(`${$self.attr('name')} validado`)
		},
		errorValidation: function ( $self ) {
			console.log(`${$self.attr('name')} NÂO validado`)
		}, 
		zoomOptions: {
			label: 'Coligada',
	        uFZommType: '2',	// 1=DataServer | 2=Consulta | 3=Dataset | 4=query 
	        clear: [{
	        	name:'COLIGADA',
	        }],
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
	    			data: 'CODCOLIGADA',
	    			formField: 'COLIGADACOD'
	    		},
	    		{
	    			data: 'NOMEFANTASIA',
	    			formField: 'COLIGADA'
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
			visibleAtv: [0, 1], //LISTA DE ATIVIDADES QUE ESSA SECTION É VISIVEL. 
			enabled: true, //TRUE = TAL SECTION É ENABLED EM ALGUMA ATIVIDADE || FALSE = SEMPRE DISABLED
			enabledAtv: [0, 1] //LISTA DE ATIVIDADES QUE ESSA SECTION NÃO ESTÁ DISABLED. "all" HABILITA TODAS AS ATIVIDADES
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
			id: 'tabela_pf_produto',
			
			fields: [
				{
					state: {type: 'default', num: [0, 1]}, //type: LISTA DE ESTADO DO FORMULARIO (EX: ['VIEW']). DEFAULT = [MOD, ADD] || NUM = LISTA DE ATIVIDADES QUE TAL CONFIGURAÇÃO VAI AGIR. (EX: [1, 2]). NULL = TODAS 
					name: 'COLIGADA_EXEMPLO', //NOME DO CAMPO
					validate: [],
					fieldType: 'zoom', 
					customActions: function( $self ) { //função para customização
						console.log('Teste Execução Custom')
						console.log($self)
					},
					zoomOptions: {
						label: 'Coligada',
						uFZommType: '3',	// 1=DataServer | 2=Consulta | 3=Dataset | 4=query 
						CodQuery: 'colleague', // dataserver | codsentenca | nome_dataset | array
						constraints:[],
						columns: [
							{ title: 'Nome', data: 'CODCOLIGADA2', className: 'text-nowrap' },
			
						],
					},
					zoomReturn: {
						//DEFAULT = RETORNO DO DATASET DIRETO PARA CAMPOS DO FORM
						//1 = UTILIZA 'DE PARA' do fields
						//2 = UTILIZA 'FUNÇÃO' do fields
						type: '1', 
						fields: [
							{
								data: 'colleagueName',
								formField: 'COLIGADA_EXEMPLO'
							}
							
						]
						
					}

				
				}
			]

		},
		{
			state: {type: 'default', num: [0, 1]},
			id: 'tblDependentes',
			fields: [
			{
				state: {type: 'default', num: [0, 1]}, //type: LISTA DE ESTADO DO FORMULARIO (EX: ['VIEW']). DEFAULT = [MOD, ADD] || NUM = LISTA DE ATIVIDADES QUE TAL CONFIGURAÇÃO VAI AGIR. (EX: [1, 2]). "all" = TODAS 
				name: 'DATAEXEMPLOTABLE', //NOME DO CAMPO
				fieldType: 'date', //TIPO DE CAMPO DATA
				validationCascade: {
					eventToValidate: 'change'
				},
				validate: ['required'],
				successValidation: function ( $self ) {
					console.log(`${$self.attr('name')} validado`)
				},
				errorValidation: function ( $self ) {
					console.log(`${$self.attr('name')} NÃO validado`)
				},
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
				state: {type: 'default', num: [0, 1]}, //type: LISTA DE ESTADO DO FORMULARIO (EX: ['VIEW']). DEFAULT = [MOD, ADD] || NUM = LISTA DE ATIVIDADES QUE TAL CONFIGURAÇÃO VAI AGIR. (EX: [1, 2]). "all" = TODAS 
				name: 'MONETARIOEXEMPLOTABLE', //NOME DO CAMPO
				class: ['text-right'],
				fieldType: 'money', //TIPO DE CAMPO monetario
				validate: ['required'], 
				requiredConfig: { depends: function(el) { return $(el).is(":visible") && $('[name="DATAEXEMPLO"]').val() != '' }, },
				successValidation: function ( $self ) {
					console.log(`${$self.attr('name')} validado`)
				},
				errorValidation: function ( $self ) {
					console.log(`${$self.attr('name')} NÂO validado`)
				},
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
					// array opcional com o name do campo a ser limpo, o evento para dar trigger e um callback
					clear: [{	
						name: 'DATAEXEMPLO',
						trigger:'change'
					},{
						name:'COLIGADATABLE',	// Se estiver em um pai filho, vai procurar um campo com esse name + ___idx
						trigger:'blur',	// evento do jquery apos limpar o campo
						afterClear: function($self){	//callback ao limpar campo
							console.log('depois de limpar eu dei esse console aqui =)',$self)
						}
					}],
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
			},
			{
				state: {type: 'default', num: [0, 1]}, //type: LISTA DE ESTADO DO FORMULARIO (EX: ['VIEW']). DEFAULT = [MOD, ADD] || NUM = LISTA DE ATIVIDADES QUE TAL CONFIGURAÇÃO VAI AGIR. (EX: [1, 2]). NULL = TODAS 
				name: 'COLIGADA_EXEMPLO', //NOME DO CAMPO
				validate: [],
				successValidation: function () {},
				errorValidation: function () {},
				fieldType: 'zoomBeta', 
				customActions: function( $self ) { //função para customização
					console.log('Teste Execução Custom')
					console.log($self)
		
				},
				zoomOptions: {
					label: 'Coligada',
					CodQuery: 'colleague', // Nome do Dataset -> Por enquanto só funciona para dataset
					/**
					 * @sourceVal -> {string}
					 * 	se sourceVal = '1', o valor da constraint eh fixo e eh necessario passar a chave valor 
					 *  com o valor desejado
					 *  se sourceVal = '2', o valor da constraint vem de um campo de formulario e eh necesario
					 *  passar a chave formField com o nome do campo
					 *  se sourceVal = '3', o usuario ira inserir o valor da constraint no filtro do modal do zoom
					 */
					constraints:[{
						sourceVal: '3', // 1 = Valor Fixo | 2 = Campo de Formulario | 3 = Valor do usuario
						field: 'mail',
					}],
					columns: [
						{ title: 'Nome', data: 'colleagueName', className: 'text-nowrap' },
		
					],
				},
				zoomReturn: {
					//DEFAULT = RETORNO DO DATASET DIRETO PARA CAMPOS DO FORM
					//1 = UTILIZA 'DE PARA' do fields
					//2 = UTILIZA 'FUNÇÃO' do fields
					type: '1', 
					fields: [
						{
							data: 'colleagueName',
							formField: 'COLIGADA_EXEMPLO'
						}
						
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
    $validator.form()
	
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

	return true
    
};