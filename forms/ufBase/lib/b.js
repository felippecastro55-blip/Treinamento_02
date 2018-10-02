var uFFw = {
	
	//objeto de configuração padrão para funcionamento de rotinas
	defaults: {
		
		dateOptions: { useCurrent: false },
		validOptions: { depends: function(el) { return $(el).is(":visible"); }, },
		moneyOptions: { prefix: '', thousands: '', decimal: ',' },

	},
		
	//Inicia procedimento do framework
	//Parametros: numero da Atividade, configuração de campos, configuração de seções
	init: function ( modForm, numState, fieldsConfig, sectionsConfig ) {
		
		this.status.init ( numState );
		this.fields.init ( modForm, numState, fieldsConfig );
		this.sections.init ( numState, sectionsConfig );
		
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
				
			}

			
			//inicia rotina de adição de classes
			uFFw.utils.addClass.init(fieldConfig);
			
			//inicia rotina de adição de validação de campos
			uFFw.utils.validate.init(fieldConfig);
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