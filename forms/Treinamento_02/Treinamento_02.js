
// variáreis declaradas no evento displayFields.js do Formulário verifica se elas existem, se não, define valores padrão
if (typeof infoWorkflow == 'undefined') infoWorkflow = {};       // objeto com informações do workflow
if (typeof modForm == 'undefined') modForm = 'ADD';    // modo do formulário

$(document).ready(function () {
	WKNumState = ((typeof infoWorkflow.WKNumState != 'undefined') ? Number(infoWorkflow.WKNumState) : 0);

	/**	Lista contendo objetos de configurações de campo
	 * as configurações são executadas em acordo com o estado do processo.
	 * type: 'MOD', 'VIEW', 'ADD' e 'default' - modo de exibição do processo.
	 * num: 'x' - codigo da atividade
	 */
	var fieldsConfig = [
		{
			state: { type: 'default', num: [2] },
			fieldType: 'aprovacao', //TIPO DE CAMPO APROVACAO
			name: 'TESTE', //STRING CHAVE PARA INICIAR APROVACAO
		},
		{
			name: 'DATALIMITE', //NOME DO CAMPO
			state: { type: 'default', num: [0, 8] }, //type: LISTA DE ESTADO DO FORMULARIO (EX: ['VIEW']). DEFAULT = [MOD, ADD] || NUM = LISTA DE ATIVIDADES QUE TAL CONFIGURAÇÃO VAI AGIR. (EX: [1, 2]). "all" = TODAS 
			fieldType: 'date', //TIPO DE CAMPO DATA
			validate: ['required'],
			fieldOptions: {
				useCurrent: false
			},
			customActions: function ($self) { //função para customização

				$self.parent().find('.iconData').on('click', function () {

					$self.trigger('click').focus();


				});
				$self.on('change', function () {

					var dataLimite = $self.val();
					var ds = DatasetFactory.getDataset('dataset_data_limite', [dataLimite], null, null)
					console.log(ds)
					var verificacao = ds.values[0]['ERRO']
					console.log(verificacao)
					if (ds.values.length > 0) {
						console.log('existe linhas')
						if (verificacao === "1" || verificacao === "1.1") {
							console.log('houve erros')
							$self.val(ds.values[0]['DETALHES']);
							var msg = 'Erro: A data selecionada deve estar pelo menos 10 dias à frente da data atual e possuir mês posterior ao atual.'
							modalVerificacaoData(msg);
						};
					};
				});
			}
		},
		{
			state: { type: ['VIEW'], num: ["all"] }, //type: LISTA DE ESTADO DO FORMULARIO (EX: ['VIEW']). DEFAULT = [MOD, ADD] || NUM = LISTA DE ATIVIDADES QUE TAL CONFIGURAÇÃO VAI AGIR. (EX: [1, 2]). "all" = TODAS 
			name: 'VALORTOTAL', //NOME DO CAMPO
			class: ['text-right'],
			fieldType: 'money', //TIPO DE CAMPO monetario
			fieldOptions: {
				prefix: 'R$ ',
				thousands: '.',
				decimal: ','
			},
			customActions: function ($self) { //função para customização

			}
		},
		{
			state: { type: 'default', num: [0, 1] },
			fieldType: 'zoom', //TIPO DE CAMPO APROVACAO
			name: 'USUARIO', //STRING CHAVE PARA INICIAR APROVACAO
			validate: ['required'],
			zoomOptions: {
				label: 'Usuários',
				uFZommType: '3',	// 1=DataServer | 2=Consulta | 3=Dataset | 4=query 
				clear: [{
					name: 'USUARIO',
				},
				{
					name: 'USUARIOCOD',
				}],
				CodQuery: 'colleague', // dataserver | codsentenca | nome_dataset | array
				constraints: [],
				// Fields que serão inseridos no dataset para o uFZommType: '3'
				dsFields: ['colleagueName', 'login', 'mail'],
				columns: [
					{ title: 'Matricula', data: 'login', className: 'text-nowrap' },
					{ title: 'Nome', data: 'colleagueName' },
					{ title: 'Email', data: 'mail' },
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
						formField: 'USUARIO'
					},
					{
						data: 'login',
						formField: 'USUARIOCOD'
					},
				]

			}
		},
		{
			state: { type: 'default', num: [0, 1] },
			fieldType: 'zoom', //TIPO DE CAMPO APROVACAO
			name: 'PROCESSO', //STRING CHAVE PARA INICIAR APROVACAO
			validate: ['required'],
			zoomOptions: {
				tooltip: false,
				label: 'processos',
				serverSide: {
					searchWithValue: async function ({ value }) {
						const processId = "FLUIGADHOC"
						const url = `/process-management/api/v2/processes/${processId}/requests/tasks?
													&expand=deadlineSpecification
													&order=deadline
													&processInstanceId=${value}`
						let response = await fetch(url)
						response = await response.json()
						return {
							dados: response.items,
							total: this.total
						}
					},
					objSearch: async function ({ start, pageSize, page }) {
						const processId = "FLUIGADHOC"
						if (!this.total) {
							const url = `/process-management/api/v2/processes/${processId}/requests/tasks/resume`
							let response = await fetch(url)
							response = await response.json()
							this.total = response.total
						}
						const url = `/process-management/api/v2/processes/${processId}/requests/tasks?
							&expand=deadlineSpecification
							&pageSize=${pageSize}
							&page=${page}
							&order=deadline`
						let response = await fetch(url)
						response = await response.json()
						return {
							dados: response.items,
							total: this.total
						}
					},
					total: 0
				},
				// Fields que serão inseridos no dataset para o uFZommType: '3'
				columns: [
					{ title: 'Protocolo', data: 'processInstanceId', className: 'text-nowrap' },
					{ title: 'Descrição', data: 'processDescription' },
					{ title: 'Sequence', data: 'movementSequence' },
				],
			},
			zoomReturn: {
				//DEFAULT = RETORNO DO DATASET DIRETO PARA CAMPOS DO FORM
				//1 = UTILIZA 'DE PARA' do fields
				//2 = UTILIZA 'FUNÇÃO' do fields
				type: '1',
				fields: [
					{
						data: 'processInstanceId',
						formField: 'PROCESSOCOD'
					},
					{
						data: 'processDescription',
						formField: 'PROCESSO'
					},
				]

			}
		},
		{
			name: 'CEPEXEMPLO', //NOME DO CAMPO
			state: { type: 'default', num: [0, 1] }, //type: LISTA DE ESTADO DO FORMULARIO (EX: ['VIEW']). DEFAULT = [MOD, ADD] || NUM = LISTA DE ATIVIDADES QUE TAL CONFIGURAÇÃO VAI AGIR. (EX: [1, 2]). "all" = TODAS 

			fieldType: 'cep', //TIPO DE CAMPO cep
			validate: ['required']
		},
		{
			name: 'INFOADICIONAIS', //NOME DO CAMPO
			state: { type: 'default', num: [0, 1] }, //type: LISTA DE ESTADO DO FORMULARIO (EX: ['VIEW']). DEFAULT = [MOD, ADD] || NUM = LISTA DE ATIVIDADES QUE TAL CONFIGURAÇÃO VAI AGIR. (EX: [1, 2]). "all" = TODAS 
			validate: ['required', 'tamanhoMaiorQue30']
		}
	];

	//Lista contendo objeto de sections
	var sectionsConfig = [
		{
			id: 'secCabecalho',
			visible: true, //TRUE = SEMPRE VISIVEL || FALSE = VISIVEL APENAS NAS ATIVIDADES CONTIDAS EM VISIBLEATV
			visibleAtv: [], //LISTA DE ATIVIDADES QUE ESSA SECTION É VISIVEL. 
			enabled: false, //TRUE = TAL SECTION É ENABLED EM ALGUMA ATIVIDADE || FALSE = SEMPRE DISABLED
			enabledAtv: [] //LISTA DE ATIVIDADES QUE ESSA SECTION NÃO ESTÁ DISABLED. "all" HABILITA TODAS AS ATIVIDADES
		},
		{
			id: 'secSolicitante',
			visible: true, //TRUE = SEMPRE VISIVEL || FALSE = VISIVEL APENAS NAS ATIVIDADES CONTIDAS EM VISIBLEATV
			visibleAtv: [], //LISTA DE ATIVIDADES QUE ESSA SECTION É VISIVEL. 
			enabled: false, //TRUE = TAL SECTION É ENABLED EM ALGUMA ATIVIDADE || FALSE = SEMPRE DISABLED
			enabledAtv: [] //LISTA DE ATIVIDADES QUE ESSA SECTION NÃO ESTÁ DISABLED. "all" HABILITA TODAS AS ATIVIDADES
		},
		{
			id: 'secRequisicao',
			visible: false, //TRUE = SEMPRE VISIVEL || FALSE = VISIVEL APENAS NAS ATIVIDADES CONTIDAS EM VISIBLEATV
			visibleAtv: [0, 1, 2, 8,], //LISTA DE ATIVIDADES QUE ESSA SECTION É VISIVEL. 
			enabled: true, //TRUE = TAL SECTION É ENABLED EM ALGUMA ATIVIDADE || FALSE = SEMPRE DISABLED
			enabledAtv: [0, 1] //LISTA DE ATIVIDADES QUE ESSA SECTION NÃO ESTÁ DISABLED. "all" HABILITA TODAS AS ATIVIDADES
		},
		{
			id: 'secAprovacaoTESTE',
			visible: false, //TRUE = SEMPRE VISIVEL || FALSE = VISIVEL APENAS NAS ATIVIDADES CONTIDAS EM VISIBLEATV
			visibleAtv: [2, 4, 6], //LISTA DE ATIVIDADES QUE ESSA SECTION É VISIVEL
			enabled: true, //TRUE = TAL SECTION É ENABLED EM ALGUMA ATIVIDADE || FALSE = SEMPRE DISABLED
			enabledAtv: [0, 1, 2] //LISTA DE ATIVIDADES QUE ESSA SECTION NÃO ESTÁ DISABLED
		},
		{
			id: 'secDependentes',
			visible: false, //TRUE = SEMPRE VISIVEL || FALSE = VISIVEL APENAS NAS ATIVIDADES CONTIDAS EM VISIBLEATV
			visibleAtv: [0, 1, 2, 4, 6], //LISTA DE ATIVIDADES QUE ESSA SECTION É VISIVEL
			enabled: true, //TRUE = TAL SECTION É ENABLED EM ALGUMA ATIVIDADE || FALSE = SEMPRE DISABLED
			enabledAtv: [0] //LISTA DE ATIVIDADES QUE ESSA SECTION NÃO ESTÁ DISABLED
		},
		{
			id: 'secCEP',
			visible: false, //TRUE = SEMPRE VISIVEL || FALSE = VISIVEL APENAS NAS ATIVIDADES CONTIDAS EM VISIBLEATV
			visibleAtv: [0, 1, 2, 4, 6], //LISTA DE ATIVIDADES QUE ESSA SECTION É VISIVEL
			enabled: true, //TRUE = TAL SECTION É ENABLED EM ALGUMA ATIVIDADE || FALSE = SEMPRE DISABLED
			enabledAtv: [0, 1] //LISTA DE ATIVIDADES QUE ESSA SECTION NÃO ESTÁ DISABLED
		}

	];

	/** Lista contendo objeto de tables
	 * Utilizado para configurar campos das tabelas.
	 */
	var tablesConfig = [
		{
			state: { type: "default", num: ["all"] },
			id: "tblItensCompras",
			fields: [
				{
					name: "ID_ITENS", //NOME DO CAMPO
					state: { type: "default", num: [0] }, //type: LISTA DE ESTADO DO FORMULARIO (EX: ['VIEW']). DEFAULT = [MOD, ADD] || NUM = LISTA DE ATIVIDADES QUE TAL CONFIGURAÇÃO VAI AGIR. (EX: [1, 2]). "all" = TODAS
					fieldType: "text", //TIPO DE CAMPO DATA
					customActions: function ($self) {
						//função para customização
					}
				},
				{
					name: "DESCRICAO", //NOME DO CAMPO
					state: { type: "default", num: [0] }, //type: LISTA DE ESTADO DO FORMULARIO (EX: ['VIEW']). DEFAULT = [MOD, ADD] || NUM = LISTA DE ATIVIDADES QUE TAL CONFIGURAÇÃO VAI AGIR. (EX: [1, 2]). "all" = TODAS
					fieldType: "text", //TIPO DE CAMPO DATA
					validate: ['required'],
					customActions: function ($self) {
						//função para customização

					}
				},
				{
					name: "QTDITEM", //NOME DO CAMPO
					state: { type: "default", num: [0] }, //type: LISTA DE ESTADO DO FORMULARIO (EX: ['VIEW']). DEFAULT = [MOD, ADD] || NUM = LISTA DE ATIVIDADES QUE TAL CONFIGURAÇÃO VAI AGIR. (EX: [1, 2]). "all" = TODAS
					fieldType: 'money', //TIPO DE CAMPO monetario
					fieldOptions: {
						prefix: '',
						thousands: '.',
						decimal: ','
					},
					customActions: function ($self) {
						//função para customização
						$self.on('keyup', function () {
							resultadoTotalLinha($self);
							console.log("somarTotal rodou")
						});
					}
				},
				{
					name: "VRUNITARIO", //NOME DO CAMPO
					state: { type: "default", num: [0] }, //type: LISTA DE ESTADO DO FORMULARIO (EX: ['VIEW']). DEFAULT = [MOD, ADD] || NUM = LISTA DE ATIVIDADES QUE TAL CONFIGURAÇÃO VAI AGIR. (EX: [1, 2]). "all" = TODAS
					fieldType: 'money', //TIPO DE CAMPO monetario
					fieldOptions: {
						prefix: 'R$ ',
						thousands: '.',
						decimal: ','
					},
					customActions: function ($self) {
						//função para customização
						$self.on('keyup', function () {
							resultadoTotalLinha($self);
						});
					}
				},
				{
					name: "TOTAL_ITENS", //NOME DO CAMPO
					state: { type: "default", num: [0] }, //type: LISTA DE ESTADO DO FORMULARIO (EX: ['VIEW']). DEFAULT = [MOD, ADD] || NUM = LISTA DE ATIVIDADES QUE TAL CONFIGURAÇÃO VAI AGIR. (EX: [1, 2]). "all" = TODAS
					fieldType: 'money', //TIPO DE CAMPO monetario
					fieldOptions: {
						prefix: 'R$ ',
						thousands: '.',
						decimal: ','
					},
					customActions: function ($self) {
						//função para customização
						$self.on('change', function () {
							console.log("somarTotal rodou")

						});
					}
				}
			],
			// Função que executa antes de deletar um ITEM da tabela.
			beforeRemoveCallback: function ($self) {
				console.info("Rodou antes de excluir a linha: ", $self);
			},
			// Função que executa após deletar um ITEM da tabela  OBS: Não retorna o $self pois a linha já foi excluida.
			afterRemoveCallback: function () {
				console.info("Rodou após excluir a linha.");
				valorTotal();
			},
			// Função que executa após adicionar um ITEM da tabela.
			afterAddLine: function ($self) {
				console.info("Rodou após adicionar uma linha.");
				lastId($self);

			}
		},
		{
			state: { type: "default", num: ["all"] },
			id: "tblRateio",
			fields: [
				{
					name: "CENTROCUSTO", //NOME DO CAMPO
					state: { type: "default", num: [0] }, //type: LISTA DE ESTADO DO FORMULARIO (EX: ['VIEW']). DEFAULT = [MOD, ADD] || NUM = LISTA DE ATIVIDADES QUE TAL CONFIGURAÇÃO VAI AGIR. (EX: [1, 2]). "all" = TODAS
					fieldType: "text", //TIPO DE CAMPO DATA
					//validate: ['required'],
					customActions: function ($self) {
						//função para customização
					}
				},
				{
					name: "VALORRATEIO", //NOME DO CAMPO
					state: { type: "default", num: [0, 9, 13] }, //type: LISTA DE ESTADO DO FORMULARIO (EX: ['VIEW']). DEFAULT = [MOD, ADD] || NUM = LISTA DE ATIVIDADES QUE TAL CONFIGURAÇÃO VAI AGIR. (EX: [1, 2]). "all" = TODAS
					fieldType: "text", //TIPO DE CAMPO DATA
					//validate: ['required'],
					customActions: function ($self) {
						//função para customização

					}
				},
				{
					name: "PORCENTAGEM", //NOME DO CAMPO
					state: { type: "default", num: [0] }, //type: LISTA DE ESTADO DO FORMULARIO (EX: ['VIEW']). DEFAULT = [MOD, ADD] || NUM = LISTA DE ATIVIDADES QUE TAL CONFIGURAÇÃO VAI AGIR. (EX: [1, 2]). "all" = TODAS
					fieldType: 'text', //TIPO DE CAMPO monetario
					customActions: function ($self) {
						//função para customização

					}
				}
			],
			// Função que executa antes de deletar um ITEM da tabela.
			beforeRemoveCallback: function ($self) {
				console.info("Rodou antes de excluir a linha: ", $self);
			},
			// Função que executa após deletar um ITEM da tabela  OBS: Não retorna o $self pois a linha já foi excluida.
			afterRemoveCallback: function () {
				console.info("Rodou após excluir a linha.");

			},
			// Função que executa após adicionar um ITEM da tabela.
			afterAddLine: function ($self) {
				console.info("Rodou após adicionar uma linha.");

			}
		}
	];

	/** Configurações das customActions
	 * customActions executam javascript, em acordo com o estado do processo:
	 * 		type: 'VIEW', 'MOD' e 'ADD' - modos de exibição do processo.
	 * 		num: 'all', '<codigo da atividade>' - código das atividades.
	 */
	var customActionsConfig = [
		{
			state: { type: ['VIEW'], num: 'all' },
			customActions: function () {
				var secNome = ['secAprovacaoTESTE']
				var arrayWKNumstate = [2]

				if (modForm == 'VIEW') { // No modo view esconde as seções de aprovações necessárias
					arrayWKNumstate.forEach(function (item, i) {
						if (item == WKNumState) {
							$('#' + secNome[i]).hide()
						}
					})
				};

				console.log('Executou customActions')
			}
		},
		{
			state: { type: "default", num: [0, 8] },
			customActions: function () {
				$("#BTNANEXOCOTACAO").on("click", function () {
					JSInterface.showCamera("Cotacao"); // anexando
					parent.$("#attachmentsStatusTab").trigger("click");
				});
			},
		},
		{
			state: { type: ['GED'] },
			customActions: function () {
				console.log('Execuntando função do custom actions no modo GED ... ')
			}
		},
		{
			state: { type: "default", num: [0] },
			customActions: function () {
				$("#addItem").trigger("click");
			}
		},
		{
			state: { type: "default", num: [0] },
			customActions: function () {

			}
		}
	];

	//função para determinar qual será a configuração padrao do validate dentro do framework
	uFFw.setDefaults('validOptions', { depends: function (el) { return true }, })

	//inicia o framework
	uFFw.init(modForm, WKNumState, fieldsConfig, sectionsConfig, tablesConfig, customActionsConfig);
	if (modForm != 'VIEW') setTimeout(() => { $validator.form(); }, 300);

});


/**
* Função padrão do Fluig. É executada quando o usuário pressiona o botão Movimentar
* antes de serem exibidas as opções de movimentação do processo.
* ## Se o fluxo não necessitar da interação do usuário, este método não será executado!  
* return false: impedirá a execução do processo. Esta opção permite que sejam exibidos erros personalizados no formulário.
* throw(“Erro”): impedirá a execução e exibirá uma tela de erro padrão do fluig com o texto informado.
* @param numState - número da atividade atual
*/
var beforeMovementOptions = function (numState) {
	console.info('VALIDAÇÃO', 'Atividade:', numState);

	if (!$validator.form()) throw 'Não será possível enviar os dados pois há campos com erro.</br>Por favor, verifique os campos destacados de vermelho.</br>' + uFFw.utils.listaErros();

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
	if (!$validator.form()) {

		parent.FLUIGC.message.alert({
			message: 'Não será possível enviar os dados pois há campos com erro.</br>Por favor, verifique os campos destacados de vermelho.</br>' + uFFw.utils.listaErros(),
			title: 'Formulário não validado',
			label: 'OK'
		});

		return false;
	}
	var quantidadeLinhas = $('[tablename="tblItensCompras"] tbody').children("tr").length
	if (quantidadeLinhas <= 1) {

		parent.FLUIGC.message.alert({
			message: 'Não será possível enviar os dados pois é necessário pelo menos um item de compra.</br>Por favor, verifique os campos destacados de vermelho.</br>' + uFFw.utils.listaErros(),
			title: 'Formulário não validado',
			label: 'OK'
		});

		return false;
	}

	return true

};

/**Validações Customizadas
 * Utilizado no fieldsConfig para executar validações nos campos do formulário.
 * deve-se incluir <nome da validação> no campo validate de fieldsConfig
 */

/**
 * Função para validação do campo textarea
 * retorna true se o campo tem pelo menos 30 caracteres
 * retorna false cc.
 */
$.validator.addMethod(
	"tamanhoMaiorQue30",
	function (value, element) {
		return value.length >= 30
	},
	"Por favor, forneça ao menos 30 caracteres."
);
function lastId($self) {
	console.log("last rodou")
	var ultimaLinha = $self.parent().children().eq(-2).find('[name^="ID_ITENS"]').val(); //ultima linha antes de criar nova linha.
	console.log(ultimaLinha)
	var novoID = Number(ultimaLinha) + 1;
	console.log(Number(ultimaLinha))
	console.log($self.children('[name^="ID_ITENS"]'))
	console.log($self.find('[name^="ID_ITENS"]'))
	$self.find('[name^="ID_ITENS"]').val(novoID);
};
function valorTotal() {
	var Itens_somados = $('.escopoTabelaCompras').find('[name^="TOTAL_ITENS"]');
	console.log(Itens_somados[1].value)
	var total = 0;
	for (let i = 1; i < Itens_somados.length; i++) {
		total = total + Itens_somados[i].value.parseReais();
	};
	$('#VALORTOTAL').val(total.formatReais());
	console.log(total)
};
/* function verificarCamposSomar($self) {
	console.log($self)
	var campos = {
		qtd: $($self).closest('tr').find('[name^="QTDITEM"]').val(),
		valorUnitario: $($self).closest('tr').find('[name^="VRUNITARIO"]').val()
	};
	console.log(campos.qtd)
	console.log(campos.valorUnitario)

	if (campos.qtd != "" && campos.valorUnitario != "") {
		var Itens_somados = $('.escopoTabelaCompras').find('[name^="TOTAL_ITENS"]');
		valorTotal(Itens_somados);
		return true;
	};
	return false
};
 */function resultadoTotalLinha($self) {
	var campos = {
		qtd: $self.closest('tr').find('[name^="QTDITEM"]').maskMoney('unmasked')[0],
		valorUnitario: $self.closest('tr').find('[name^="VRUNITARIO"]').maskMoney('unmasked')[0]
	};
	console.log(campos.qtd)
	console.log(campos.valorUnitario)
	var campoTotalLinha = $self.closest('tr').find('[name^="TOTAL_ITENS"]');
	if (campos.qtd <= 0 || campos.valorUnitario === 0) {
		campoTotalLinha.maskMoney('mask', 0);
		valorTotal();

		console.log('executou primeiraa verificação')
		console.log($self.closest('tr').find('[name^="TOTAL_ITENS"]').val())
	} else if (campos.qtd != 0 && campos.valorUnitario != 0) {
		var valorTotalLinha = campos.qtd * campos.valorUnitario;
		console.log(valorTotalLinha)
		console.log(valorTotalLinha.formatReais())
		campoTotalLinha.val(valorTotalLinha.formatReais());
		valorTotal();

		console.log('executou a segunda verificação')
	};
};

$('.escopoTabelaCompras').on('click', '.rateio', function () {
	var idLinha = $(this).closest('tr').find('[name^="ID_ITENS"]').val();
	console.log(idLinha)

	var myModal = FLUIGC.modal({
		title: 'Title',
		content: `<div class="panel panel-default">
                        <div class="page-header">
                            <h3>
                                <span style="padding-left: 20px;" class="fs-no-margin fs-ellipsis fs-full-width">
                                    <i class="fluigicon fluigicon-group"></i>
                                    Itens da Compra</span>
                                <small class="title-small"></small>
                            </h3>
                        </div>
                        <!-- tabela de acoes complementares -->
                        <div class="panel-body">
                            <div class="row">
                                <div class="col-xs-12">
                                    <table class="table table-hover table-striped" tablename="tblRateio"
                                        noaddbutton="true" nodeletebutton="true">
                                        <thead>
                                            <tr class="uppercase">
                                                <th class="text-center" style="width: 7%;">ID</th>
                                                <th class="text-center" style="width: 63%;">CENTRO DE CUSTO</th>
                                                <th class="text-center" style="width: 14%;">VALOR</th>
                                                <th class="text-center" style="width: 14%;">PORCENTAGEM</th>
                                                <th class="text-center" style="width: 2%;"></th>
                                            </tr>
                                        </thead>
                                        <tbody class="escopoTabelaRateio">
                                            <tr style="display:none;">
                                                <td class="itm-dados ItemVlrTotal">
                                                    <input type="text" class="form-control text-center" name="ID_ITENS"
                                                        id="ID_ITENS" readonly>
                                                </td>
                                                <td class="itm-dados ItemVlrTotal">
                                                    <input type="text" class="form-control" name="CENTROCUSTO"
                                                        id="CENTROCUSTO">
                                                </td>
                                                <td class="itm-dados ItemVlrTotal">
                                                    <input type="text" class="form-control" name="VALORRATEIO"
                                                        id="VALORRATEIO">
                                                </td>
                                                <td class="itm-dados ItemVlrTotal">
                                                    <input type="text" class="form-control" name="PORCENTAGEM"
                                                        id="PORCENTAGEM">
                                                </td>
                                                <td class="acoes-linha">
                                                    <a href="javascript:;" class="remove-linha excluir"
                                                        uf-removeChild="tblRateio" data-toggle="tooltip"
                                                        title="Remover Item"><span
                                                            class="fluigicon fluigicon-remove-circle fluigicon-sm"></span></a>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div class="col-md-offset-8 col-md-4">
                                        <button type="button" class="btn btn-primary btn-block" id="addItemRateio"
                                            uf-addChild="tblRateio"><i class="fluigicon fluigicon-plus-sign"
                                                aria-hidden="true"></i> Novo Item</button>
                                    </div>
                                </div>`,
		id: 'data-rateio',
		size: 'full',
		actions: [{
			'label': 'Save',
			'bind': 'salvartabelamodal',
			'autoClose': false
		}, {
			'label': 'Close',
			'autoClose': true
		}]
	}, function (err, data) {
		if (err) {
			// do error handling
		} else {
			// do something with data
		}
	});

	//Button Add Linha na tabela
	var modeloLinhaOculto = $('#data-rateio .escopoTabelaRateio tr').eq(0).prop('outerHTML');
	var addLinha = $(modeloLinhaOculto).removeAttr('style').prop('outerHTML');
	$('#data-rateio').on('click', '#addItemRateio', function () {
		//var modeloLinha = $('#data-rateio .escopoTabelaRateio tr').eq(1).prop('outerHTML');
		console.log(addLinha)
		$('#data-rateio .escopoTabelaRateio').append(addLinha);
		console.log(linhas().last().find('[name^="ID_ITENS"]'))
		linhas().last().find('[name^="ID_ITENS"]').val(idLinha);
	});
	//Button excluir
	$('#data-rateio .escopoTabelaRateio').on('click', '.excluir', function () {
		var linhaAtual = $(this)
		linhaAtual.closest('tr').remove();
		linhaAtual.closest('tr').find('[name^="ID_ITENS"]')
		console.log('Iniciou')
	});
	//Salvar tabela
	var buttonSalvar = $('#data-rateio [salvartabelamodal]');
	buttonSalvar.on('click', function () {
		console.log("salvou")

		console.log(linhas)
		var filtroLinhas = linhasTabelaOculta().filter(function () {
			return $(this).find('[name^="ID_ITENS_OCULTO"]').val() == idLinha
		});
		filtroLinhas.remove()

		for (var i = 1; i < linhas().length; i++) {

			$("#addItemRateioOculto").trigger("click");
			var desc = linhas().eq(i).find('[name^="CENTROCUSTO"]').val();
			var valor = linhas().eq(i).find('[name^="VALORRATEIO"]').val();
			var ptg = linhas().eq(i).find('[name^="PORCENTAGEM"]').val();

			linhasTabelaOculta().last().find('[name^="ID_ITENS_OCULTO"]').val(idLinha);
			linhasTabelaOculta().last().find('[name^="CENTROCUSTO"]').val(desc);
			linhasTabelaOculta().last().find('[name^="VALORRATEIO"]').val(valor);
			linhasTabelaOculta().last().find('[name^="PORCENTAGEM"]').val(ptg);

		};
	});
	function linhasTabelaOculta() {
		return $('#secRateio .escopoTabelaRateio tr');
	};
	function linhas() {
		return $('#data-rateio .escopoTabelaRateio tr');
	};

	//Carregando itens salvos
	for (var i = 1; i < linhasTabelaOculta().length; i++) {
		console.log("rodou")
		if (idLinha == linhasTabelaOculta().eq(i).find('[name^="ID_ITENS_OCULTO"]').val()) {
			console.log("rodou for")
			$("#addItemRateio").trigger("click"); //nova linha padrão da tabela oculta
			linhas().last().find('[name^="CENTROCUSTO"]').val(linhasTabelaOculta().eq(i).find('[name^="CENTROCUSTO"]').val());
			linhas().last().find('[name^="VALORRATEIO"]').val(linhasTabelaOculta().eq(i).find('[name^="VALORRATEIO"]').val());
			linhas().last().find('[name^="PORCENTAGEM"]').val(linhasTabelaOculta().eq(i).find('[name^="PORCENTAGEM"]').val());
		};
	};


});
function modalVerificacaoData(msg) {

	var myModal = FLUIGC.modal({
		title: 'Erro na seleção da data',
		content: msg,
		id: 'Limite-data',
		actions: [{
			'label': 'OK',
			'autoClose': true
		}]
	}, function (err, data) {
		if (err) {
			// do error handling
		} else {
			// do something with data
		}
	});

}