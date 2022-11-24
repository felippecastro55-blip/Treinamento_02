class FornecedorController {

    constructor() { 
        this.iniciado = false;
    }

    init() {
        if (!fornecedorController.iniciado) {
            fornecedorController.listaFornecedores();
            fornecedorController.iniciado = true;
        }
    }   

    async listaFornecedores(){
        
        let loading = uFNotify.loading('Aguarde, carregando fornecedores...')
		loading.show();     
        
        try {             
            var codigoNatureza = $("#codigoNatureza").val();

            var consulta = '39';

            var data = {
                FORNECEDORNATUREZA: String(codigoNatureza),						
            };

            
            var colunas = [
				{ 
                    className: 'col-md-1',
                    data: 'FORNECEDORID' },
				{ 
                    className: 'col-md-3',
                    data: 'FORNECEDORNOME' },
				{ 
                    className: 'col-md-3',
                    data: 'FORNECEDORCNPJ' },								
                {
                    className: 'col-md-2',
                    orderable: false,
                    data: null,                    
                    render: function (data, type, full, meta) {
                        return fornecedorView.carregaSwitchAtivoFornecedor(data);
                    },
                },
                {
                    className: 'col-md-2',
                    orderable: false,
                    data: null,                    
                    render: function (data, type, full, meta) {
                        return fornecedorView.carregaBotoesAcaoFornecedor(data);
                    },
                },						
			]
            
            UTILS_AUX.initDataTableWithPagination($("#tbFornecedores"), data, consulta, colunas);

            $("#tbFornecedores_length").parent().removeClass();
            $("#tbFornecedores_length").parent().addClass("col-sm-offset-10 col-sm-1");

            $("#tbFornecedores_filter").parent().removeClass();
            $("#tbFornecedores_filter").parent().addClass("col-sm-1");            
           
            loading.hide();
           
        } catch(e) {
            loading.hide();

            uFNotify.alertErro('Erro ao carregar fornecedores: ' + e);
        }
    };

    adicionarFornecedor(){

        if ($("#idFornecedor___").length == 0) {

            var tpl = fornecedorView.edicao();
                tpl = '<tr>'+ tpl + '</tr>';

            var target = $(`#tBodyFornecedor`);
            var index = 0;

            var data = { 
                    id: '', 
                    index: index, 
                    nome: '',
                    cnpj: '',                    
                    hideBtnAdd: '',
                    hideBtnEdit: 'hide',
                    hideBtnRemove: 'hide'
            };

            var htmlTarget = Mustache.render(tpl, data);

            target.prepend(htmlTarget);            

            $("#cnpjFornecedor___"+index).keydown(function(e) {								
                $(this).mask('00.000.000/0000-00');
            });

        } else {
            Swal.fire({
                icon: 'info',
                title: 'Atenção',
                text: 'Já foi adicionado um novo registro para inclusão do novo documento! É necessário salva-lo primeiro através do botão ✓ na coluna de ações! ',
                footer: ''
            })
            
            $("#btnAdd___0").addClass('blink_me');
        }
    };

    editaFornecedor(fornecedorId){   
        
        let loading = uFNotify.loading('Aguarde, carregando dados do fornecedor...')
		loading.show();

        try {
        
            var tpl = fornecedorView.edicao();            

            var data = {
                "FORNECEDORID": fornecedorId
            }

            var codigoConsulta = '40';

            var successCallBack = function (content) {
                // verifica se o DataSet retornou um erro
                if ( content.values.length == 1 && content.values[0]['ERRO'] == '1' ) { // se há apenas uma linha e a coluna chama-se ERRO
                    console.error('O DataSet UF_CrudPaginado_DBFluigConsulta foi executado, mas retornou um erro: ' + content.values[0]['DETALHES']);
                    loading.hide();
                    uFNotify.notiError('O DataSet UF_CrudPaginado_DBFluigConsulta foi executado, mas retornou um erro:</br>' + content.values[0]['DETALHES']);
                    
                } else {    // se não há a coluna ERRO
                    console.info('RESPOSTA vcXMLRPC com sucesso', content);                                           

                    var fornecedorRet = content.values[0];

                    var data = {                             
                        index: fornecedorRet.FORNECEDORID, 
                        nome: fornecedorRet.FORNECEDORNOME,
                        cnpj: fornecedorRet.FORNECEDORCNPJ,
                        ativo: fornecedorRet.FORNECEDORATIVO,                            
                        hideBtnAdd: 'hide',
                        hideBtnEdit: ''
                        
                    };
            
                    var htmlTarget = Mustache.render(tpl, data);
                    
                    $("#btnEdit___"+fornecedorId).parents("tr").html(htmlTarget);
                    
                    $("#btnEdit___"+fornecedorId).parents("tr").find("td input[id=cnpjFornecedor___"+fornecedorId+"]").keydown(function(e) {
                        $(this).mask('00.000.000/0000-00');
                    });

                    loading.hide();
                }
            }

            var errorCallBack = '';

            UTILS_AUX.getDBFluigConsulta(data, codigoConsulta, loading, successCallBack, errorCallBack);            
        } catch(e) {
            loading.hide();

            uFNotify.notiError('Erro ao carregar dados do fornecedor: ' + e);
        }
    }

    validaCamposFornecedor(index){

        var validFieldsAux = true;
        var erro = '';

        if (UTILS_AUX.isEmpty($("#nomeFornecedor___"+index).val())){
            erro += 'nome';
            validFieldsAux = false;
        }
        if (UTILS_AUX.isEmpty($("#cnpjFornecedor___"+index).val())){
            if (erro != ""){
                erro += ', '
            }
            erro += 'CNPJ';
            validFieldsAux = false;
        }

        if (!validFieldsAux) {
             uFNotify.notiError("Preencha o(s) campo(s) " + erro + '!');
        } else {
            if (!UTILS_AUX.validaCNPJ($("#cnpjFornecedor___"+index))) {
                validFieldsAux = false;
                uFNotify.notiError("CNPJ incorreto!");
            }
        }
        
        return validFieldsAux;
    }

    verificaDuplicidadeFornecedor(cnpjFornecedor, tipoConsulta, fornecedorId, loading){    

        return new Promise(function (resolve, reject) {

            var codigoNatureza = $("#codigoNatureza").val();

            var data = {
                FORNECEDORCNPJ: String(cnpjFornecedor.trim()),
                FORNECEDORNATUREZA: String(codigoNatureza)
            }
            
            if (tipoConsulta == '42') {
                data["FORNECEDORID"] = String(fornecedorId);
            }    

            DatasetFactory.getDataset('UF_CrudPaginado_DBFluigConsulta', [tipoConsulta, JSON.stringify(data)], null, null, {

                success: function(content){

                    console.info('RESPOSTA vcXMLRPC com sucesso New', content);

                    if (content != null && content.values != null && content.values.length > 0) {
                        if ( content.values.length == 1 && content.values[0]['ERRO'] == '1' ) { // se há apenas uma linha e a coluna chama-se ERRO
                            console.error('RESPOSTA vcXMLRPC com erro', 'O DataSet foi consultado, mas retornou um erro:', content.values[0]['DETALHES']);
                            loading.hide();                            
                            uFNotify.notiError('Erro ao consultar cadastro: ' + content.values[0]['DETALHES']);                            

                            resolve(true); // tem erro
                        } else {    // se não há a coluna ERRO
                            var fornecedorCadastrado = content.values[0];
                                
                            if (fornecedorCadastrado.FORNECEDORID != ""){     
                            
                                loading.hide();
                                uFNotify.notiError('Já existe um fornecedor com o CNPJ ' + fornecedorCadastrado.FORNECEDORCNPJ);

                                resolve(true); // tem duplicado
                            } else {
                                resolve(false); // não tem duplicado
                            }
                        }
                    } else {                        
                        resolve(false); // não tem duplicado
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {                                
                    console.error('RESPOSTA vcXMLRPC com erro', jqXHR, textStatus, errorThrown);
                    loading.hide();
                    var msg = jqXHR.responseJSON.message;   // resgata a mensagem de erro real que acorreu com o DataSet
                    uFNotify.notiError('Houve um erro ao realizar consulta ao dataset UF_CrudPaginado_DBFluigConsulta.<br>Detalhes: ' + msg);
                    reject(true);
                },
            });

        });            
    }

    async incluiFornecedor(index){

        let loading = uFNotify.loading('Aguarde, incluindo fornecedor...')
		loading.show();

        try {

            var validFields = true;

            validFields = fornecedorController.validaCamposFornecedor(index)

            if (validFields) {

                var temDuplicadoOuErro = false;

                var nomeFornecedor = $("#nomeFornecedor___"+index).val();                    
                var cnpjFornecedor = $("#cnpjFornecedor___"+index).val();                    
                var codigoNatureza = $("#codigoNatureza").val();                    

                temDuplicadoOuErro = await fornecedorController.verificaDuplicidadeFornecedor(cnpjFornecedor,'43',index, loading);

                if (!temDuplicadoOuErro) {
                    
                    var data = {
                        FORNECEDORNOME: String(nomeFornecedor.trim()),
                        FORNECEDORCNPJ: String(cnpjFornecedor.trim()),
                        FORNECEDORNATUREZA: String(codigoNatureza),
                        FORNECEDORATIVO: String("S"),
                    }

                    var codigoConsulta = '38';

                    var successCallBack = function (content) {                        
                        // verifica se o DataSet retornou um erro
                        if ( content.values.length == 1 && content.values[0]['ERRO'] == '1' ) { // se há apenas uma linha e a coluna chama-se ERRO
                            console.error('RESPOSTA vcXMLRPC com erro', 'O DataSet foi consultado, mas retornou um erro:', content.values[0]);
                            loading.hide();
                            uFNotify.notiError('Erro ao incluir fornecedor: ' + content.values[0]['DETALHES']);                                
                            
                        } else {    // se não há a coluna ERRO
                            console.info('RESPOSTA vcXMLRPC com sucesso', content);                        

                            uFNotify.notiSuccess('Seu fornecedor foi incluído com sucesso!');
                            
                            $("#tbFornecedores").DataTable().clear().draw(false);

                            loading.hide();
                        }
                    };

                    var errorCallBack = '';
                    
                    UTILS_AUX.getDBFluigConsulta(data, codigoConsulta, loading, successCallBack, errorCallBack);
                }
            } else {
                loading.hide();
            }
        } catch(e) {
            loading.hide();

            uFNotify.notiError('Erro ao incluir fornecedor: ' + e);
        }

    }    

    async alteraFornecedor(fornecedorId){

        let loading = uFNotify.loading('Aguarde, alterado dados do fornecedor...')
		loading.show();

        try {

            var validFields = true;

            validFields = fornecedorController.validaCamposFornecedor(fornecedorId)

            if (validFields) {

                var temDuplicadoOuErro = false;
                                
                var nomeFornecedor = $("#nomeFornecedor___"+fornecedorId).val();
                var cnpjFornecedor = $("#cnpjFornecedor___"+fornecedorId).val();                

                temDuplicadoOuErro = await fornecedorController.verificaDuplicidadeFornecedor(cnpjFornecedor,'42',fornecedorId, loading); // 7 - consulta db para verificar se tem documento com nome igual porém com id diferente

                if (!temDuplicadoOuErro) {       
                    
                    var data = {
                        FORNECEDORID: String(fornecedorId),
                        FORNECEDORNOME: String(nomeFornecedor.trim()),
                        FORNECEDORCNPJ: String(cnpjFornecedor.trim()),                                             
                    }

                    var codigoConsulta = '41';

                    var successCallBack = function (content) {
                        // verifica se o DataSet retornou um erro
                        if ( content.values.length == 1 && content.values[0]['ERRO'] == '1' ) { // se há apenas uma linha e a coluna chama-se ERRO
                            console.error('RESPOSTA vcXMLRPC com erro', 'O DataSet foi consultado, mas retornou um erro:', content.values[0]);                                    
                            loading.hide();
                            uFNotify.notiError('Erro ao alterar fornecedor: ' + content.values[0]['DETALHES']);                                
                        } else {    // se não há a coluna ERRO
                            console.info('RESPOSTA vcXMLRPC com sucesso', content);                        
                            
                            uFNotify.notiSuccess('Seu fornecedor foi alterado com sucesso!');
                            
                            $("#tbFornecedores").DataTable().clear().draw(false);

                            loading.hide();
                        }
                    };

                    var errorCallBack = '';
                    
                    UTILS_AUX.getDBFluigConsulta(data, codigoConsulta, loading, successCallBack, errorCallBack);
                }
            } else {
                loading.hide();
            }

            
        } catch(e) {
            
            uFNotify.notiError('Erro ao alterar dos dados do fornecedor: ' +e);
            loading.hide();
        }
    }

    confirmaExclusaoFornecedor(fornecedorId){

        Swal.fire({
            title: 'Tem certeza que deseja excluir este fornecedor?',
            text: "Não será possível reverter!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Remover',
            cancelButtonText: 'Cancelar',            
        }).then(async (result) => {
            if (result.isConfirmed) {                
                await fornecedorController.excluiFornecedor(fornecedorId);
            }
        })
    }

    async excluiFornecedor(fornecedorId){

        let loading = uFNotify.loading('Aguarde, excluindo fornecedor...')
		loading.show();

        try {            

            var data = {
                FORNECEDORID: String(fornecedorId)                                            
            }

            var codigoConsulta = '44';

            var successCallBack = function (content) {
                // verifica se o DataSet retornou um erro
                if ( content.values.length == 1 && content.values[0]['ERRO'] == '1' ) { // se há apenas uma linha e a coluna chama-se ERRO
                    console.error('RESPOSTA vcXMLRPC com erro', 'O DataSet foi consultado, mas retornou um erro:', content.values[0]);                            

                    uFNotify.notiError('Erro ao consultar cadastro: ' + content.values[0]['DETALHES']);
                    
                    loading.hide();
                } else {    // se não há a coluna ERRO
                    console.info('RESPOSTA vcXMLRPC com sucesso', content);                        

                    uFNotify.notiSuccess('Seu fornecedor foi excluído com sucesso!');

                    loading.hide();
                    
                    $("#tbFornecedores").DataTable().clear().draw(false);
                }
            };

            var errorCallBack = '';
            
            UTILS_AUX.getDBFluigConsulta(data, codigoConsulta, loading, successCallBack, errorCallBack);            

            
        } catch(e) {
            loading.hide();
            SuFNotify.notiError('Erro ao excluir fornecedor: ' + e);
        }
    }

    confirmarAtivarDesativarFornecedor(fornecedorId) {

        var usuarioAtivo = "N";

        if ($("#ativaFornecedor___"+fornecedorId).is(":checked")) {
            usuarioAtivo = "S";
        }

        var mensagem = "";
        var statusAnterior = "";
  
        if (usuarioAtivo == "S") {
          mensagem = "Você tem certeza que deseja ativar este fornecedor?";
          statusAnterior = false;
        } else {
          mensagem = "Você tem certeza que deseja bloquear este fornecedor?";
          statusAnterior = true;
        }

        Swal.fire({
            title: mensagem,
            text: "",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.isConfirmed) {
                fornecedorController.ativarDesativarFornecedor(fornecedorId);    
            } else {
                $("#ativaFornecedor___"+fornecedorId).prop("checked" , statusAnterior);
            }
          })
    }

    ativarDesativarFornecedor(fornecedorId) {

        let loading = uFNotify.loading('Aguarde, alterando status fornecedor...')
		loading.show();

        try {

            var fornecedorAtivo = "N";

            if ($("#ativaFornecedor___"+fornecedorId).is(":checked")) {
                fornecedorAtivo = "S";
            }

            var data = {
                FORNECEDORID: String(fornecedorId),
                FORNECEDORATIVO: String(fornecedorAtivo)
            }

            var codigoConsulta = '45';

            var successCallBack = function (content) {
                // verifica se o DataSet retornou um erro
                if ( content.values.length == 1 && content.values[0]['ERRO'] == '1' ) { // se há apenas uma linha e a coluna chama-se ERRO
                    console.error('RESPOSTA vcXMLRPC com erro', 'O DataSet foi consultado, mas retornou um erro:', content.values[0]);   
                    uFNotify.notiError('O DataSet foi consultado, mas retornou um erro:', content.values[0]);   
                    loading.hide();                              
                } else {    // se não há a coluna ERRO
                    console.info('RESPOSTA vcXMLRPC com sucesso', content);
                
                    var msgSuccess = 'Fornecedor bloqueado com sucesso!'

                    if (fornecedorAtivo == "S") {
                        msgSuccess = 'Fornecedor ativado com sucesso!'
                    } 

                    uFNotify.notiSuccess(msgSuccess);                    

                    loading.hide();
                }
            };

            var errorCallBack = '';
            
            UTILS_AUX.getDBFluigConsulta(data, codigoConsulta, loading, successCallBack, errorCallBack);
        } catch(e) {
            
            loading.hide();

            uFNotify.notiError('Erro ao alterar bloquear/ativar fornecedor: ' + e);
        }
    }    
}