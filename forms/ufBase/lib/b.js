var uFFw = {
	
	//objeto de configuração padrão para funcionamento de rotinas
	defaults: {
		
		dateOptions: { useCurrent: false },
		validOptions: { depends: function(el) { return $(el).is(":visible"); }, },
		moneyOptions: { prefix: '', thousands: '', decimal: ',' },
		zoomReturn: function (cmp, info){
			
			for (var key in info) {
				$('[name="' + key + '"]').val(info[key]);
			}
			
			
		},
		zoomFields: function ( cmp, info, fields ) {
			
			for (var key in info) {
				
				var field = fields.find ( function( elemento ) {
					
					return elemento.data == key
					
				});
				
				if ( typeof field != 'undefined'){
					
					$('[name="' + field.formField + '"]').val(info[key]);
					
				}
				
			}
			
			$('form').trigger('change');
			
		} 
		

	},
		
	//Inicia procedimento do framework
	//Parametros: numero da Atividade, configuração de campos, configuração de seções
	init: function ( modForm, numState, fieldsConfig, sectionsConfig ) {
		
		this.status.init ( );
		this.fields.init ( modForm, numState, fieldsConfig );
		this.sections.init ( numState, sectionsConfig );
		
	},
	
	status: {
		
		$elBase:  $('section#secCabecalho .status-solicitacao'),
		//inicia procedimento de seções
		//parametros: numero da atividade, configuração de seções
		init: function ( ) {
			
			// inicializa o objeto para visualização
			
			// criando os elementos e inserindo-os no DOM
            var options = {
                class: 'status',
                style: 'color:'+ufStatus.cfn+';background-color:'+ufStatus.cbk+';',
                'data-toggle': 'popover',
                'data-title': ufStatus.ico+' '+ufStatus.tit,
                'data-content': ufStatus.des,
            };
			
			this.start ( options );
			
		},
		
		start: function ( options ) {
			
			this.$elBase.append( $('<div>', opt).html(ufStatus.ico+' '+ufStatus.tit) );
            FLUIGC.popover('[data-toggle="popover"]', { trigger:'hover', placement:'auto', viewport:'html', html:true} );
			
		}


	},

	
	fields: {
		
		//inicia procedimento de campos
		//parametros: numero da atividade, configuração de campos
		init: function (modForm, numState, fieldsConfig) {
			//verifica se campo tem ação em tal atividade e em tal modo
			fieldsConfig.forEach( function(fieldConfig) {

				if ( typeof fieldConfig.state.type == 'undefined' || fieldConfig.state.type == 'default' ||  fieldConfig.state.type == null){

					if( modForm == 'ADD' || modForm == 'MOD' ) {

						uFFw.fields.start(fieldConfig);

					}


				}else{

					if ( uFFw.utils.verificaConteudo(modForm, fieldsConfig.state.type) ) {

						if( uFFw.utils.verificaConteudo(numState, fieldsConfig.state.num) ) {

							uFFw.fields.start(fieldConfig);

						}

					}

				}

			});
		},

		start: function (fieldConfig) {
			
			
			if ( fieldConfig.fieldType == 'aprovacao') {
				
				//inicia rotina de tipo de campo APROVACAO
				uFFw.fields.aprovacao.init(fieldConfig);

			} else if ( fieldConfig.fieldType == 'date' ) {
				
				//inicia rotina de tipo de campo DATA
				uFFw.fields.date.init(fieldConfig);
				
			} else if ( fieldConfig.fieldType == 'money' ) {
				
				//inicia rotina de tipo de campo MONETARIO
				uFFw.fields.money.init(fieldConfig);
				
			}  else if ( fieldConfig.fieldType == 'zoom' ) {
				
				//inicia rotina de tipo de campo ZOOM
				uFFw.fields.zoom.init(fieldConfig);
				
			}
			
			//inicia rotina de adição de classes
			uFFw.utils.addClass.init(fieldConfig);
			
			//inicia rotina de adição de validação de campos
			uFFw.utils.validate.init(fieldConfig);
		},
		
		zoom: {

			//inicia aprovacao de formulario
			//parametro: objeto de configuração do campo
			init: function ( fieldConfig ) {
				
				if ( typeof fieldConfig.zoomReturn == 'undefined' ) {
					
					this.start ( $('button[uf-zoom="' + fieldConfig.name + '"]'), fieldConfig.zoomOptions, uFFw.defaults.zoomReturn );
					
				} else {
					
					if ( typeof fieldConfig.zoomReturn.type == 'undefined' ||  fieldConfig.zoomReturn.type == 'default' ) {
						
						this.start ( $('button[uf-zoom="' + fieldConfig.name + '"]'), fieldConfig.zoomOptions, uFFw.defaults.zoomReturn );
						
					} else {
						
						if ( fieldConfig.zoomReturn.type == '1' ) {
							
							this.start ( $('button[uf-zoom="' + fieldConfig.name + '"]'), fieldConfig.zoomOptions,  uFFw.defaults.zoomFields, fieldConfig.zoomReturn.fields );
							
						} else {
							
							this.start ( $('button[uf-zoom="' + fieldConfig.name + '"]'), fieldConfig.zoomOptions, fieldConfig.fields );
							
						}
						
					}
					
				}

			},
		
			start: function ( $el, zoomOptions, zoomCallback, listFields ) {
				
				$el.uFZoom({
                    loading: 'Aguarde, consultando cadastro de ' + zoomOptions.label + '...',
                    label: zoomOptions.label,
                    title: 'Cadastro de ' + zoomOptions.label,
                    uFZommType: zoomOptions.uFZommType,	// 1=DataServer | 2=Consulta | 3=Dataset | 4=query | 5=array
                    CodQuery: zoomOptions.CodQuery, // dataserver | codsentenca | nome_dataset | array
                    constraints: zoomOptions.constraints,
                    columns: zoomOptions.columns,
                }, zoomCallback, listFields);
				
			},

		},
		
		//Objeto de configuração de elementos de money
		money: {

			//inicia aprovacao de formulario
			//parametro: objeto de configuração do campo
			init: function ( fieldConfig ) {
				
				if ( typeof fieldConfig.fieldOptions == 'undefined' ) {
					
					this.start ( $('[name="' + fieldConfig.name + '"]'),  uFFw.defaults.moneyOptions );
					
				} else {
					
					this.start ( $('[name="' + fieldConfig.name + '"]'), fieldConfig.fieldOptions );
					
				}

			},
		
			start: function ( $el, options ) {
				
				$el.maskMoney( options ).maskMoney('mask', this.value);
				
			}

		},
		
		
		//Objeto de configuração de elementos de data
		date: {

			//inicia aprovacao de formulario
			//parametro: objeto de configuração do campo
			init: function ( fieldConfig ) {
				
				if ( typeof fieldConfig.fieldOptions == 'undefined' ) {
					
					this.start ( $('[name="' + fieldConfig.name + '"]'),  uFFw.defaults.dateOptions );
					
				} else {
					
					this.start ( $('[name="' + fieldConfig.name + '"]'), fieldConfig.fieldOptions );
					
				}
				
				

			},
		
			start: function ( $el, options ) {
				
				FLUIGC.calendar ( $el, options );
				
			}

		},

		//Objeto de configuração de elementos de aprovação
		aprovacao: {

			//inicia aprovacao de formulario
			//parametro: objeto de configuração do campo
			init: function ( fieldConfig ) {


				var $elBase =  $('section#secAprovacao'+ fieldConfig.name),
			        $cmpAprov = $('section#secAprovacao' + fieldConfig.name + ' input[name="APROVADO' + fieldConfig.name + '"]'),
			        $cmpAprovNom = $('section#secAprovacao' + fieldConfig.name + ' input[name="APROVADORNOME' + fieldConfig.name + '"]'),
			        $cmpAprovDta = $('section#secAprovacao' + fieldConfig.name + ' input[name="APROVADODATA' + fieldConfig.name + '"]'),
			        $cmpAprovCod = $('section#secAprovacao' + fieldConfig.name + ' input[name="APROVADORID' + fieldConfig.name + '"]'),
			        $cmpAprovMail = $('section#secAprovacao' + fieldConfig.name + ' input[name="APROVADOREMAIL' + fieldConfig.name + '"]'),
			        $cmpObs = $('section#secAprovacao' + fieldConfig.name + ' textarea[name="APROVADOOBS' + fieldConfig.name + '"]'),
			        $elAprovMsg = $('section#secAprovacao' + fieldConfig.name + ' .msg-aprov div.alert');


				var exbMsgAprov = function(strSel, ckd) {

			        // se está marcando
		            if (ckd) {

		                // resgata informações do aprovador
		                var nm = $cmpAprovNom.val();
		                var dt = $cmpAprovDta.val();

		                // se não encontrou o campo (modo view), busca o mapa do formulário
		                //if (nm == undefined) nm = ufBPM.mapFormulario.getMap().txtAprovadorNome;
		                //if (dt == undefined) dt = ufBPM.mapFormulario.getMap().txtAprovacaoData;
						
						// ao aprovar pelo painel de atendimento, o mapa do formulário não é atualizado
						// sendo assim, não adianta consultar dele no modo view, sempre virá em branco ""
		                if (nm == undefined) nm = $('[name="APROVNOME' + fieldConfig.name + '"]').html();
		                if (dt == undefined) dt = $('[name="APROVDATA' + fieldConfig.name + '"]').html();
						
		                // remove as classes
		                $elAprovMsg.removeClass('alert-success alert-danger');

		                // verifica qual valor selecionado
		                switch ( String(strSel) ) {
			                case 'S': // aprovado

			                    // mensagem de aprovação
			                    var msg = '<strong><i class="fa fa-check-circle" aria-hidden="true"></i> PEDIDO APROVADO!</strong> Aprovação realizada por '+nm+' em '+dt;
			                    $elAprovMsg.removeClass('alert-danger').removeClass('alert-warning').addClass('alert-success').html( msg ).show();

			                    break;
			                case 'N': // reprovado

			                    // mensagem de reprovação
			                    var msg = '<strong><i class="fa fa-times-circle" aria-hidden="true"></i> PEDIDO REPROVADO!</strong> Reprovação realizada por '+nm+' em '+dt;
			                    $elAprovMsg.removeClass('alert-success').removeClass('alert-warning').addClass('alert-danger').html( msg ).show();

			                    break;
			                case 'A':
			                	// mensagem de Ajuste
			                    var msg = '<strong><i class="fa fa-times-circle" aria-hidden="true"></i> PEDIDO PARA AJUSTE!</strong> Reprovação para que seja ajustado realizada por '+nm+' em '+dt;
			                    $elAprovMsg.removeClass('alert-danger').removeClass('alert-success').addClass('alert-warning').html( msg ).show();
			                	
			                	break;
			                	
			                case 'C':
			                	// mensagem de Ajuste
			                    var msg = '<strong><i class="fa fa-times-circle" aria-hidden="true"></i> PEDIDO PARA AJUSTE!</strong> Reprovação para que seja ajustado realizada por '+nm+' em '+dt;
			                    $elAprovMsg.removeClass('alert-danger').removeClass('alert-success').addClass('alert-warning').html( msg ).show();
			                	
			                	break;
			                	
			                default: // sem seleção
			                    console.error('Seleção na aprovação não reconhecida: ');
			            };

			            } else {    // se está desmarcando

			                // oculta a mensagem
			                $elAprovMsg.hide();

			            };

		        };

				$cmpAprov.on('change', function() {
	                // atualiza a data no campo
	                $cmpAprovDta.val( moment().format('DD/MM/YYYY HH:mm:ss') );
	                $cmpAprovNom.val(parent.WCMAPI.user);
	                $cmpAprovCod.val(parent.WCMAPI.userCode);
	                $cmpAprovMail.val(parent.WCMAPI.userEmail);
	                // exibe a mensagem no formulário
	                exbMsgAprov( this.value, this.checked );
        		});
				
				this.valid(fieldConfig, $cmpAprov, $cmpObs)
				
			},
		
			valid: function (fieldConfig, $cmpAprov, $cmpObs) {
				
				$cmpAprov.rules('add', { required: true});
    			$cmpObs.rules('add', { required:{ depends: function(el) { return $('input[name="APROVADO' + fieldConfig.name + '"]:checked').val() != 'S' }, },})

				
			}

		}


	},

	sections: {

		//inicia procedimento de seções
		//parametros: numero da atividade, configuração de seções
		init: function (numState, sectionsConfig) {

			//Percorre configuração de seções dando as devidas tratativas pra cada uma
			sectionsConfig.forEach(function(sectionConfig){

				//verifica Condições de exibição
				if ( sectionConfig.visible ){
					$('section#' + sectionConfig.id).show();

				}else{
					//caso atividade atual esteja dentro da lista exibe a section
					if ( uFFw.utils.verificaConteudo(numState, sectionConfig.visibleAtv) ) {

						$('section#' + sectionConfig.id).show()
					}
				};


				//verifica Condições de edição
				if( !sectionConfig.enable ){

					$('section#' + sectionConfig.id).setDisabled();

				}else{

					//caso atividade atual não esteja dentro da lista, aplica o setDisabled
					if ( !uFFw.utils.verificaConteudo(numState, sectionConfig.enabledAtv) ) {

						$('section#' + sectionConfig.id).setDisabled()
					}


				};


			})
		},


	},


	utils: {
		
		addClass: {
			
			init: function ( fieldConfig ) {
				
				if ( !typeof fieldConfig.class == 'undefined' || !fieldConfig.class.length == 0) {
					
					this.start ( $('[name="' + fieldConfig.name + '"]'), fieldConfig.class );
					
				};

			},
			
			start: function ( $el, listClass ) {
				
				listClass.forEach( function( classe ) {
					
					$el.addClass( classe );
					
				});
				
				
			}
			
			
			
		},
		
		/**
		 * Retorna a lista (string de html) de campos não validados e respectivas mensagem
		 */
		listaErros: function( ) {
			var lstHtml = '</br>';
			$.each($validator.errorList, function (id, campo) {
				var label = $('label.control-label[for="' + campo.element.name + '"]').text();
				lstHtml += '<strong>' + ((label != undefined)?label:campo.element.name) + '</strong>: ' + campo.message + '</br>'
			})
			return lstHtml;
		},
		
		//objeto de tratativa de validação em campos
		validate: {
			
			init: function( fieldConfig ) {
				
				if( fieldConfig.required ){
					
					if ( typeof fieldConfig.requiredConfig == 'undefined' || requiredConfig.type == 'default') {
						
						uFFw.utils.validate.start ( $('[name="' + fieldConfig.name + '"]'), uFFw.defaults.validOptions );
						
					} else {
						
						uFFw.utils.validate.start ( $('[name="' + fieldConfig.name + '"]'), fieldConfig.config );
						
					}
					
					
				}
				
			},
			
			//inicia validação em um elemento
			//parametros: elemento jquery do campo, configuração (padrão quando elemento é visivel)
			start: function ( $el, config ) {
				
				$el.rules( 'add', { required: config } );
				
			}
			
			
		},
		
		

		//verifica se o conteudo passado esta na lista
		verificaConteudo: function( conteudo, lista ) {
			return lista.some( function( conteudoLoop ) {
				return conteudo == conteudoLoop
			});
		}



	},

};



/**
 * @desc   	Desabilita todos os campos colocando-os no formato de VIEW do Fluig
 * @version	2.3.0
 */
$.fn.setDisabled = function () {
    console.info('DESABILITA', $(this), 'Desabilita os elementos.');
    
    var $el = $(this);  // resgata o elemento atual
    
    // retira a(s) opção(es) de remover linha da(s) tabela(s)
    $el.find('tbody tr:not(:first-child) td.acoes-linha a.remove-linha').hide();
    
    // oculta todos os botões zoom da seção
    $el.find('div.form-group button[uf-zoom]').hide();
    
    // desabilita todos os botões
    $el.find('div.form-group button[type="button"]').attr('disabled', true);
    
    // oculta os addons e botões agrupados aos campos
    $el.find('div.form-group div.input-group .input-group-addon').hide();
    $el.find('div.form-group div.input-group .input-group-btn').hide();
    
    // retira a classe .input-group para melhor formatação do valor do campo
    $el.find('div.form-group div.input-group').attr('class', '');

    // oculta todos os help-block da seção
    $el.find('div.form-group p.help-block').hide();
    
    // retira as mensagens indicadas para serem retiradas no modo view
    $el.find('[retirar-view]').hide();
    
    // define a altura dos elementos para melhor visual da tela (principalmente para <textarea>)
    $el.find('span.form-control').css('height','auto');
    
    // percorre todos os inputs do tipo radios que estão marcados
    $el.find('input[type="radio"]:checked').each(function() {
        
        // resgata o valor que será exbido
        var conteudo = $(this).data('exibicao');
        
        // resgata nome do campo
        var nm = $(this).attr('name');
    
        // resgata o elemento pai de todos os radios
        var $pai = $(this).parents('div.btn-group');
        $pai.hide();    // oculta ele
        
        // adiciona um novo elemento com o valor do campo e seus atributos
        $('<span>', {html: conteudo, 'data-idoriginal': nm}).addClass('form-control').insertAfter( $pai );
        
    });
    
    // percorre os radios não marcados e oculta o button
    $el.find('input[type="radio"]:not(:checked)').each(function () {
        $(this).parents('label').hide();
    });
	
	// retira os eventos do mouse dos campos checkbox
	$el.find('div.checkbox').css('pointer-events', 'none');
    
    // percorre todos os elementos com .form-control
    $el.find('.form-group:not(.uf-disabled) .form-control:not([type="hidden"])').each(function () {
        var el = $(this);
        var valor, id = '';

        // verifica o nome do elemento
        switch (this.localName) {
            case 'input':
            case 'textarea':
                desabilitar(el, this.value, el.attr('name'));
                break;
            case 'select':
                desabilitar(el, el.find('option:selected').text(), el.attr('name'));
                break;
        };

    });
    
    // função que cria um novo elemento e esconde o campo original 
    function desabilitar(elemento, valor, id) {
        
        // resgata as classes aplicadas ao elemento
        var cls = elemento.attr('class');
        
        // se houver input com a classe de código do zoom (codinput)
        var cod = elemento.parents('.ufZoom').find('input.codinput').val();
        if (cod) valor = cod +' - '+ valor;
        
        // adiciona um novo elemento (logo após o original) com o valor do campo e seus atributos
        $('<span>', {html: valor, 'data-idoriginal': id}).addClass(cls).insertAfter(elemento);

        // adiciona uma classe informativa no elemento
        // para não desabilitar duas vezes quando for chamada
        // a função duas vezes no mesmo elemento
        elemento.parents('.form-group').addClass('uf-disabled');
        
        // esconde o campo original do DOM
        elemento.hide();
    };
    
}



/**
 * @desc   	Inicializa o zoom no campo de acordo com as opções
 * @since   1.0.0
 */
$.fn.uFZoom = function (zoomInfo, callback, listFields) {
    console.info('ZOOM', 'Inicializando o zoom no elemento.');
    
    var $elZoom = $(this);
    
    // verifica se há o atributo de loading do bootstrap em todos os button do zoom
    // se já tiver, não adiciona novamente
    if ( !$elZoom.attr('data-loading-text') ) $elZoom.attr('data-loading-text', '<i class="fas fa-spinner fa-pulse"></i>');
    
    // remove todos os eventos 'click' dos zooms já criados
    // para não dar incompatibilidade com a nova inicialização        
    // ao clicar em qualquer elemento para abrir o zoom
    $elZoom.off('click').on('click', function() {
		
        // este selZomm
        var $this = $(this);
		
        var msgLoading = FLUIGC.loading(window, {
            textMessage: zoomInfo.loading,
            overlayCSS: {
                backgroundColor: '#000',
                opacity: 0.6,
                cursor: 'wait'
            },
            baseZ: 1000,
            fadeIn: 200,
            fadeOut: 400,
            timeout: 0,
        });
        msgLoading.show();
        
        $this.button('loading');    // troca o ícone
                
        var DataSetName; // nome do DataSet que será consultado
        var parametros; // parâmetros para chamar o DataSet
        var filtros = null; // filtros para a query no RM
		
		// objeto global que receberá a lista de cada zoom utilizado no formulário
		// esse objeto é populado dinamicamente de acordo com o uso no uFZoom
		// o objetivo é dinamizar as consultas evitando acessar o servidor
		// a todo momento, deixando assim, a lista armazenada localmente
		if (typeof lstZoom == 'undefined') lstZoom = {}; 
        
		// verifica se há informado uma variável para armazenar o resultado
		// e se a lista desse zoom já está armazenada na variável
		if (zoomInfo.lstLocal != undefined) {
			if (lstZoom[zoomInfo.lstLocal] != undefined) {
				console.info('ZOOM', 'A lista deste zoom já foi consultada do servidor.');
				exbTabela(lstZoom[zoomInfo.lstLocal]);	// chama a função para preenchimento
				return;	// saí do zoom
			}
		}
        
        // monta os filtros e parâmetros para consulta ao DataSet
        try {
            
            // verifica o tipo de consulta ao RM (via DataSever ou ConsultaSQL)
            switch ( String(zoomInfo.uFZommType) ) {
                case '1':    // consulta no RM utilizando DataServer (ds_RMDataServer)
                    
                    DataSetName = 'ds_RMDataServer';    // consulta dinâminca de DataServer do RM

					// se não informou a coligada, utiliza a 1
					var CODCOLIGADA = ((zoomInfo.CODCOLIGADA)?zoomInfo.CODCOLIGADA:'1');
					
                    // monta parâmetros (na ordem): NOMEDATASERVER, CODCOLIGADA, CONTEXTO
                    //parametros = new Array(zoomInfo.CodQuery, CODCOLIGADA, "");
					parametros = new Array(zoomInfo.CodQuery, "", "CODCOLIGADA="+CODCOLIGADA);

                    break;
                case '2':    // consulta no RM utilizando ConsultaSQL (ds_RMConsulta)

                    DataSetName = 'ds_RMConsulta';    // consulta dinâminca de query do RM

                    // monta parâmetros (na ordem): CODSENTECA, CODCOLIGADA, APLICACAO
                    parametros = new Array(zoomInfo.CodQuery, "0", "T"); // consultas gravadas na coligada global (0) do RM

                    break;
                case '3':    // consulta no RM utilizando um DataSet específico

                    DataSetName = zoomInfo.CodQuery;    // resgata o nome do DataSet no html

                    // não passa parâmetros
                    parametros = null;

                    break;
                case '4':    // consulta utilizando uma query

                    DataSetName = 'ds_FLUIGConsulta';    // dataset de select query

                    // monta parâmetros: QUERY
                    parametros = new Array(zoomInfo.CodQuery); // informa a query

                    break;
                case '5':    // consulta utilizando um array já pronto

                    DataSetName = '';    // não exite dataset para este tipo
                    parametros = ''// não exite parâmetros para este tipo

                    break;
                case '6':    // consulta utilizando um grupo

                    DataSetName = '';    // não exite dataset para este tipo
                    parametros = ''// não exite parâmetros para este tipo

                    break;
                default:
                    throw 'Tipo de uFZoom desconhecido';
            };
            
            // se há filtro na consulta, inicia a montagem das constraints
            if (zoomInfo.constraints.length > 0) {

                // percorre os constraints formatando os filtros
                filtros = [];   // transforma a variável em array
                $.each(zoomInfo.constraints, function() {

                    // verifica a origem do valor do filtro
                    switch ( String(this.sourceVal) ) {
                        case '1':    // se o valor é fixo (sourceVal = 1), ou seja, passado direto pelo zoomInfo
                            filtros.push( DatasetFactory.createConstraint(this.field, this.value, this.value, ConstraintType.MUST) );
                            break;
                        case '2':   // se o valor é uma referência (sourceVal = 2), ou seja, vem de um campo do formulário
                            var valor = $('form input[name="'+this.formField+'"]').val();
                            filtros.push( DatasetFactory.createConstraint(this.field, valor, valor, ConstraintType.MUST) );                            
                            break;
						case '3':	// se é uma função que retorna o objeto constraint
                            var cons = ((typeof this.value == 'function')?this.value():this.value);
							filtros.push(cons);
                            break;
						case '4':	// se é uma variável global
                            filtros.push( DatasetFactory.createConstraint(this.field, eval(this.value), eval(this.value), ConstraintType.MUST) );
							break;
                    };

                });

            };
            
        } catch(e) {
			exbErro('Ocorreu um erro ao montar os filtros da lista. Por favor, tente novamente.');
            console.error('Ocorreu um erro ao montar os filtros e parâmetros do DataSet:', e);
        };
		
		// se é um array local, não consulta o servidor
		if (zoomInfo.uFZommType == '5') {
			
			try {
				
				// valida se a variável informada é mesmo um array
				if (!Array.isArray(zoomInfo.CodQuery)) throw 'Array inválido!'; 
				
				// faz a chamada do modal com os dados do array
				if (zoomInfo.lstLocal != undefined) lstZoom[zoomInfo.lstLocal] = zoomInfo.CodQuery;	// cria/atualiza a lista localmente
				exbTabela(zoomInfo.CodQuery);	// chama a função para preenchimento
				
			} catch(e) {
				console.error('A variável informada não é um array:', e);
				exbErro('Ocorreu um erro ao consultar o cadastro de '+zoomInfo.label+'. Por favor, tente novamente.');
				return; // cancela da função de zoom
			};
						
		} else if (zoomInfo.uFZommType == '6') {  // consulta grupo pela API
            
			try {
                
                // consulta a API de grupos para listar os usuários
                $.ajax({
                    type: 'GET',
                    url: '/api/public/2.0/groups/listUsersByGroup/'+zoomInfo.CodQuery,
                    success: function (data, textStatus, jqXHR) { // tipos de dados: Anything, String, jqXHR
                        console.info('Resposta do ajax: ', data, textStatus);
                        if (!Array.isArray(data.content)) {
                            exbErro('Resposta da API inválida!');
                            return;
                        } else {

                            // faz a chamada do modal com os dados do array
                            if (zoomInfo.lstLocal != undefined) lstZoom[zoomInfo.lstLocal] = data.content;	// cria/atualiza a lista localmente
                            exbTabela(data.content);	// chama a função para preenchimento

                        };

                    },
                    error: function (jqXHR, textStatus, errorThrown) { // tipos de dados: jqXHR, String, String
						console.error('RESPOSTA vcXMLRPC com erro', jqXHR, textStatus, errorThrown);
						var msg = ((jqXHR.responseJSON !== undefined)?jqXHR.responseJSON.message:textStatus);
						exbErro('Ocorreu um erro ao consultar o cadastro de '+zoomInfo.label+'. Por favor, tente novamente.<br>Detalhes: '+msg);
                    },
                });
				
			} catch(e) {
				exbErro('Ocorreu um erro ao consultar o cadastro de '+zoomInfo.label+'. Por favor, tente novamente.<br>' + e);
				return; // cancela da função de zoom
			};
            
        } else {
			
            if (zoomInfo.cliente == 'tbc') {
                
                var pesq = $this.parents('tr').find('input[name^="ITMNOME"]').val();
                
                var fina = $('[name="FINALIDCOD"]').val();
                
                parametros = zoomInfo.colunas;
                
                var filtros = [];
                filtros.push( DatasetFactory.createConstraint('codSentenca', 'WS.0004', 'WS.0004', ConstraintType.MUST) );
                filtros.push( DatasetFactory.createConstraint('codColigada', '1', '1', ConstraintType.MUST) );
                filtros.push( DatasetFactory.createConstraint('codAplicacao', 'T', 'T', ConstraintType.MUST) );
                filtros.push( DatasetFactory.createConstraint('CODIGO', pesq, pesq, ConstraintType.MUST) );
                filtros.push( DatasetFactory.createConstraint('TIPO', fina, fina, ConstraintType.MUST) );
                                
                try {
                    // consulta DataSet no servidor
                    DatasetFactory.getDataset(DataSetName, parametros, filtros, null, {
                        success: function (content) {
                            console.info('RESPOSTA vcXMLRPC com sucesso', content);

                            exbTabela(content.values);	// chama a função para preenchimento
                            
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            console.error('RESPOSTA vcXMLRPC com erro', jqXHR, textStatus, errorThrown);
                            var msg = ((jqXHR.responseJSON !== undefined)?jqXHR.responseJSON.message:textStatus);   // resgata a mensagem de erro real que acorreu com o DataSet
                            exbErro('Ocorreu um erro ao consultar o cadastro de '+zoomInfo.label+'. Por favor, tente novamente.<br>Detalhes: '+msg);
                        },
                    });
                } catch(e) {
                    console.error('Ocorreu um erro ao consultar o DataSet:', e);
                    exbErro('Ocorreu um erro ao consultar o cadastro de '+zoomInfo.label+'. Por favor, tente novamente.');
                    return; // cancela da função de zoom
                };
                
            } else {
                
                // realiza consulta no DataSet conforme parâmetros
                try {
                    // consulta DataSet no servidor
                    DatasetFactory.getDataset(DataSetName, parametros, filtros, null, {
                        success: function (content) {
                            console.info('RESPOSTA vcXMLRPC com sucesso', content);
                            // verifica se o DataSet retornou um erro
                            if ( content.values.length == 1 && content.columns[0] == 'ERRO' ) { // se há apenas uma linha e a coluna chama-se ERRO
                                console.error('O DataSet foi consultado, mas retornou um erro:', content.values[0]);
                                exbErro('Ocorreu um erro ao consultar o cadastro de '+zoomInfo.label+'. Por favor, tente novamente.<br>Detalhes: '+content.values[0].ERRO);
                            } else {    // se não há a coluna ERRO
                            	if(zoomInfo.distinct){
                            		content.values = content.values.reduce(function(a,b,c){
                            			var achou = a.find(function(d){return d[zoomInfo.distinctInput].toLocaleLowerCase() == b[zoomInfo.distinctInput].toLocaleLowerCase()})
                            			if(typeof achou == 'undefined') a.push(b)
                            			return a
                            		}, [])
                            	}
                            	
                            	if (zoomInfo.lstLocal != undefined) lstZoom[zoomInfo.lstLocal] = content.values;	// cria/atualiza a lista localmente
                                exbTabela(content.values);	// chama a função para preenchimento
                            }
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            console.error('RESPOSTA vcXMLRPC com erro', jqXHR, textStatus, errorThrown);
                            var msg = ((jqXHR.responseJSON !== undefined)?jqXHR.responseJSON.message:textStatus);   // resgata a mensagem de erro real que acorreu com o DataSet
                            exbErro('Ocorreu um erro ao consultar o cadastro de '+zoomInfo.label+'. Por favor, tente novamente.<br>Detalhes: '+msg);
                        },
                    });
                } catch(e) {
                    console.error('Ocorreu um erro ao consultar o DataSet:', e);
                    exbErro('Ocorreu um erro ao consultar o cadastro de '+zoomInfo.label+'. Por favor, tente novamente.');
                    return; // cancela da função de zoom
                };
                
            }
			
		}
   
        // função que monta a tabela e exibe o modal
        function exbTabela(listaZoom) {
			
			var tplContent = '';
			tplContent += '<div class="row">';
			tplContent += '<div class="col-xs-6"><caption>Selecione um item da tabela</caption></div>';
			tplContent += '<div class="col-xs-6">';
			tplContent += '<div class="form-group">';
			tplContent += '<div class="input-group">';
			tplContent += '<input type="search" class="form-control" placeholder="Pesquisar ...">';
			tplContent += '<div class="input-group-addon"><span class="fluigicon fluigicon-search"></span></div>';
			tplContent += '</div>';
			tplContent += '</div>';
			tplContent += '</div>';
			tplContent += '</div>';
    		tplContent += '<div class="row">';
    		tplContent += '<div class="col-xs-12">';
    		tplContent += '<table class="table">';
    		tplContent += '<thead></thead>';
    		tplContent += '<tbody></tbody>';
    		tplContent += '</table>';
    		tplContent += '</div>';
    		tplContent += '</div>';

			var zoomModal = FLUIGC.modal({
				title: zoomInfo.title,
				size: ((zoomInfo.size)?zoomInfo.size:'large'),	// full, large, small'
				content: tplContent,
                formModal: true,
				id: 'zoomModal',
                actions: [{
                    label: 'Cancelar',
                    autoClose: true,
					classType: 'btn btn-default',
                },{
					label: 'INSERIR >',
					bind: 'data-inserirselecaozoom',
					classType: 'btn btn-primary',
				}]
			}, function (err, data) {
				if (err) {
					exbErro('Ocorreu um erro ao exibir o modal. Por favor, tente novamente.');
					console.error('Erro no FLUIGC.modal()', err);
            		return; // cancela da função de zoom
				}
			});
			
			// resgata o input referente a este zoom
			var $cmp = $this.parents('.input-group').find('input');
			
			// oculta a barra padrão do Fluig
			parent.$('#workflowview-header').hide();
			
            // preenche a tabela com os itens inicializando o pluing do DataTable
            // a inicialização do plugin DataTable deve ser feita
            // depois que o modal já está renderizado no DOM
            var dtZoom = $('#zoomModal').find('table').DataTable({
				dom: "<'row'<'col-xs-12't>><'row tabela-rodape'<'col-xs-12 col-md-5'i><'col-xs-12 col-md-7'p>>",
				language: {
					thousands: ".",
					zeroRecords: "<i class='fa fa-exclamation-circle' aria-hidden='true'></i> Nenhum item localizado",
					emptyTable: "<i class='fa fa-exclamation-circle' aria-hidden='true'></i> Nenhum item localizado",
					info: "Exibindo _TOTAL_ itens",
					infoEmpty: "Nenhum item localizado",
					infoFiltered: "(filtro de um total de _MAX_ itens)",
					paginate: {
						first: "Primeira",
						previous: "Anterior",
						next: "Próxima",
						last: "Última"
					},
				},
				columns: zoomInfo.columns,
                data: listaZoom,
                paging: false,
            });

            // define ação de pesquisa e foca no campo de busca          
            $('#zoomModal input[type="search"]').keyup(function() {
                dtZoom.search($(this).val()).draw() ;
            }).focus();

			// ao fechar o modal
			$('#zoomModal').on('hide.bs.modal', function() {
				// exibe novamente a barra do fluig
				parent.$('#workflowview-header').show();
			});

            // ao clicar na linha (clique simples apenas para selecionar)
            $('#zoomModal table tbody tr').on('click', function () {
				
				// se for a linha de tabela vazia, sai da function
				if ($(this).find('td').hasClass('dataTables_empty')) return; 
				
                // se já estiver selecionada
                if ($(this).hasClass('selected')) {
                    $(this).removeClass('selected');    // remove a classe de seleção
                } else {    // se ainda não estiver selecionada
                    dtZoom.$('tr.selected').removeClass('selected'); // remove a seleção de todas as linhas
                    $(this).addClass('selected');
                }
            });

            // ao da um duplo clique em uma das linhas
            $('#zoomModal table tbody tr').on('dblclick', function () {
				
				// se for a linha de tabela vazia, sai da function
				if ($(this).find('td').hasClass('dataTables_empty')) return;

                // faz chamada para preenchimento do formulário
                callback( $cmp, dtZoom.row(this).data(), listFields );

                zoomModal.remove(); // fecha o modal do Fluig
                $('#zoomModal').remove(); // remove o modal do DOM

            });

			// evento click do botão de inserir do modal
            $('#zoomModal [data-inserirselecaozoom]').on('click', function() {
				
				// localiza a linha selecionada
				var $lin = $('#zoomModal table tbody tr.selected');
				
				// se não tiver linha selecionada, sai da funciton
				if (!$lin.length) return; 
                
                // faz chamada para preenchimento do formulário
                callback( $cmp, dtZoom.rows('.selected').data()[0], listFields );
    
                zoomModal.remove(); // fecha o modal do Fluig
                $('#zoomModal').remove(); // remove o modal do DOM
          
            });
            
            // fix tamanho do modal
            $('#zoomModal .modal-body').css('max-height',  (window.innerHeight-200)+'px');
            $('#zoomModal .modal-body').css('overflow-x','hidden');

            $(window).trigger('resize')
            
            msgLoading.hide(); $this.button('reset');
			
        };
        
        // função que exibe o erro para o usuário
        function exbErro(msg) {
            // exibe mensagem para o usuário
            parent.FLUIGC.toast({ title: 'Erro!', message: msg, type: 'danger', timeout: 4000 });
            // espera um tempo (2s antes do toast) e oculta o loading
            msgLoading.hide(); $this.button('reset');
        };
         
    });   
}
