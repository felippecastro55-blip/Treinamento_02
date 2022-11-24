class PainelView {

    iniciaAbaPainel(mostraPadroesTamanho) {

        var view = {
            mostraPadroesTamanho: mostraPadroesTamanho,            
        }
        
        var template =  `
            <div class="row" id="abaFornecedores"> 
                <div class="col-md-12 group-form-uf" id="accordionFornecedores"> 
                    <div class="row">
                        <div class="col-xs-12 col-md-12 col-lg-12">
                            <a class="collapse-icon" id="accordionFornecedoresTitle" data-toggle="collapse" data-parent="#accordionFornecedores" href="#collapseFornecedores" style="text-decoration: none;">
                                <p class="p-title">								
                                    <strong>Fornecedores</strong>
                                </p>
                            </a>
                        </div>
                    </div>
                    <div class="row panel-collapse collapse" id="collapseFornecedores" style="padding: 1rem;">
                        <button type="button" class="btn uf-green-gradient btn-sm" style="margin-left: 1rem;margin-bottom: 1rem;" onclick="fornecedorController.adicionarFornecedor()">
                            <i class="fluigicon fluigicon-plus-sign icon-xs"></i> Adicionar
                        </button>
                        <div id="divTbFornecedores">
                            <table class="table" id="tbFornecedores" style="width:100%">
                                <thead class="thead-dark" id="theadFornecedor">
                                    <tr>
                                        <th class="col-md-1 thFornecedor fs-text-left">ID</th>
                                        <th class="col-md-3 thFornecedor fs-text-center">Nome</th>
                                        <th class="col-md-3 thFornecedor fs-text-center">CNPJ</th>                        
                                        <th class="col-md-2 thFornecedor fs-text-center">Ativo</th>                        
                                        <th class="col-md-2 thFornecedor fs-text-center">Ações</th> 
                                    </tr>
                                </thead>
                                <tbody id="tBodyFornecedor">  										
                                </tbody>        
                            </table>
                        </div>
                    </div>
                </div>
            </div>            
        `;

        return Mustache.render(template, view);
    }    
}