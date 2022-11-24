/**
 *
 * CRUD PAGINADO
 *
 * @desc        Script padrão do widget
 * @copyright   2022 upFlow.me
 * @version     1.0.0 
 * @author      Fernando Wesley Teixeira <fernando.teixeira@upflow.me>
 *
 */
 
 var fornecedorController;
 var fornecedorModel; 
 var fornecedorView;
 var padraoTamanhoView; 
 
  var UF_CrudPaginado = SuperWidget.extend({
     //método iniciado quando a widget é carregada
     init: async function() {         
         
         fornecedorController = new FornecedorController();         
         fornecedorModel = new FornecedorModel();         
         fornecedorView = new FornecedorView();         
         painelView = new PainelView();         
 
         $("#nav-mat-copa-limpeza-higiene-tab").trigger("click");
 
         this.bindButton();
         
     },
     alteraCodigoNatureza(codigoNatureza, elementId) {
         
         fornecedorController.iniciado = false;         
         
         $(".div-content-tab").html('');
 
         var mostraPadroesTamanho = false;
 
         if (codigoNatureza == "2.16.06") {
             mostraPadroesTamanho = true;
         }
         
         $("#"+elementId).html(painelView.iniciaAbaPainel(mostraPadroesTamanho));
         $("#codigoNatureza").val(codigoNatureza);
         
         fornecedorController.init();         
     },
     bindButton() {
         $("#accordionFornecedores").on("click", fornecedorController.init);
     }
 });