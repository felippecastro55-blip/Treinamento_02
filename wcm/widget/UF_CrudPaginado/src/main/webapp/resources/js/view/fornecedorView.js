class FornecedorView {    

    carregaSwitchAtivoFornecedor(data) {
        var ativo = "";

        if (data.FORNECEDORATIVO == "S") {
            ativo = 'checked';
        }

        var html = `<div class="form-group schedules">
                        <div class="switch switch-green-gradient switch-labels">
                            <input id="ativaFornecedor___${data.FORNECEDORID}" type="checkbox" class="switch-input" ${ativo}  onchange="fornecedorController.confirmarAtivarDesativarFornecedor('${data.FORNECEDORID}');"/>
                            <label for="ativaFornecedor___${data.FORNECEDORID}" class="switch-button"></label>
                        </div>                                    
                    </div>`    

        return html;
    }

    carregaBotoesAcaoFornecedor(data) {    
        var html = `<div class="col-md-offset-2 col-md-1 div-buttons-col">
                        <i class="fa fa-pencil btn-icon-action-small-black" aria-hidden="true" id="btnEdit___${data.FORNECEDORID}" data-toggle="tooltip" data-placement="top" title="Editar Fornecedor" onclick="fornecedorController.editaFornecedor('${data.FORNECEDORID}');"></i>                                    
                    </div>
                    <div class="col-md-1">
                        <i class="fa fa-trash-o btn-icon-action-small-black" aria-hidden="true" id="btnRemove___${data.FORNECEDORID}" data-toggle="tooltip" data-placement="top" title="Excluir Fornecedor" onclick="fornecedorController.confirmaExclusaoFornecedor('${data.FORNECEDORID}');"></i>                                    
                    </div>
                    <div class="col-md-1">
                        <i class="fa fa-building-o btn-icon-action-small-black" aria-hidden="true" id="btnVinculaUnidades___${data.FORNECEDORID}" data-toggle="tooltip" data-placement="top" title="Unidades do Fornecedor" onclick="fornecedorUnidadeController.listaUnidadesFornecedor('${data.FORNECEDORID}', '${data.FORNECEDORNOME}', '${data.FORNECEDORCNPJ}');"></i>                                    
                    </div>
                    <div class="col-md-1">
                        <i class="fa fa-list-ul btn-icon-action-small-black" aria-hidden="true" id="btnItens___${data.FORNECEDORID}" data-toggle="tooltip" data-placement="top" title="Itens do Fornecedor" onclick="itemFornecedorController.listaItensFornecedor('${data.FORNECEDORID}', '${data.FORNECEDORNOME}', '${data.FORNECEDORCNPJ}');"></i>                                    
                    </div>`

        return html;
    }    
   
    edicao() {
        return `
            <td class="col-md-1">
                <input type="text" id="idFornecedor___{{index}}" class="form-control" placeholder="ID" value="{{id}}" readonly/>
            </td>
            <td class="col-md-2">
                <input type="text" id="nomeFornecedor___{{index}}" class="form-control" placeholder="Nome" value="{{nome}}" />
            </td>
            <td class="col-md-2">
                <input type="text" id="cnpjFornecedor___{{index}}" class="form-control" placeholder="00.000.000/0000-00" maxlength="14" value="{{cnpj}}" />
            </td>		
            <td class="col-md-2">
                
            </td>		
            <td class="col-md-1">
                <div class="col-md-offset-2 col-md-1 div-buttons-col {{hideBtnAdd}}">
                    <i class="fa fa-floppy-o btn-icon-action-save" aria-hidden="true" id="btnAdd___{{index}}" onclick="fornecedorController.incluiFornecedor({{index}});"></i>
                </div>

                <div class="col-md-offset-2 col-md-1 div-buttons-col {{hideBtnEdit}}">
                    <i class="fa fa-floppy-o btn-icon-action-save" aria-hidden="true" id="btnEdit___{{index}}" onclick="fornecedorController.alteraFornecedor({{index}});"></i>
                </div>

                <div class="col-md-1">
                    <i class="fa fa-times-circle-o btn-icon-action-cancel" aria-hidden="true" id="btnCancel___{{index}}" onclick="$('#tbFornecedores').DataTable().clear().draw(false);"></i>				
                </div>
            </td>
        `;
    }    
}