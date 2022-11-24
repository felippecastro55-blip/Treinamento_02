class FornecedorModel {
    buscaFornecedores(loading) {
        try {
            var codigoNatureza = $("#codigoNatureza").val();

            var data = {
                FORNECEDORNATUREZA: String(codigoNatureza)
            };

            var codigoConsulta = '39';

            UTILS_AUX.getDBFluigConsulta(data, codigoConsulta, loading, '','');       
            
        } catch(e) {
            loading.hide();

            uFNotify.notiError('Erro ao carregar dados do fornecedor: ' + e);
        }
    }   
    
    buscaItensFornecedor(fornecedorId, loading) {	

        return new Promise(function (resolve, reject) {
            var data = {
                FORNECEDORID: fornecedorId
            };
        
            DatasetFactory.getDataset('UF_CrudPaginado_DBFluigConsulta', ['55', JSON.stringify(data)], null, null, {

                success: function(content){

                    console.info('RESPOSTA vcXMLRPC com sucesso New', content);

                    if (content.values && content.values.length) {

                        if (content.values[0]['ERRO'] == '1') {
                            console.error('O DataSet UF_CrudPaginado_DBFluigConsulta foi executado, mas retornou um erro: ' + content.values[0]['DETALHES']);
                            loading.hide();
                            uFNotify.notiError('O DataSet UF_CrudPaginado_DBFluigConsulta foi executado, mas retornou um erro:</br>' + content.values[0]['DETALHES']);
                            resolve(false);
                        } else {
                            if (content != null && content.values != null && content.values.length > 0) {
                                resolve(content.values);
                            } else {
                                resolve(false);
                            }                        
                        }
                    } else {
                        resolve(false);
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {                                
                    console.error('RESPOSTA vcXMLRPC com erro', jqXHR, textStatus, errorThrown);
                    loading.hide();
                    var msg = jqXHR.responseJSON.message;   // resgata a mensagem de erro real que acorreu com o DataSet
                    uFNotify.notiError('Houve um erro ao realizar consulta ao dataset UF_CrudPaginado_DBFluigConsulta.<br>Detalhes: ' + msg);
                    reject(false);
                },
            });
        });
    }
}