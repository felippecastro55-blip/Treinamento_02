<#assign reposi='UF_CrudPaginado'> 
<#assign versao = '1.0.0'> 
<#assign parametros="{usuAdmin: '${usuAdmin!''}'}">

<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.2/css/all.css" integrity="sha384-fnmOCqbTlWIlj8LyTjo7mOUStjsKC4pOpQbqyi7RrhN7udi9RwhKkMHpvLbHG9Sr" crossorigin="anonymous" />
<link href="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.6-rc.0/css/select2.min.css" rel="stylesheet" />
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

<div id="${reposi}_${instanceId}" class="uF ${reposi} super-widget wcm-widget-class fluig-style-guide" data-params="${reposi}.instance({reposi:'${reposi}', versao:'${versao}', widgetId: ${instanceId}, preferences: ${parametros}})">
    
    <div class="row">
        <div class="col-md-12">
            <h1 style="margin-top: 2rem;margin-left: 1rem;">
                <i class="fas fa-clipboard-list"></i>
                <strong>Painel de Crud Paginado</strong>
                
            </h1>
        </div>
    </div>

    <!-- INÍCIO: Modal de Fornecedor -->
    <div id="modalFornecedor" class="modal-uf">
        <!-- Modal content -->
        <div class="modal-content-uf">
            <span class="close-uf" onclick="$('#modalFornecedor').hide();">&times;</span>                
            <div id="modalContentBody">
                
            </div>
        </div>
    </div>
    <!-- FINAL: Modal de Marcas -->

    <div class="row">
        <div class="col-xs-12">            
            <#--  NAV-TABS  -->
            <div class="panel-body container-fluig">
                <nav>
                    <ul class="nav nav-tabs clearfix" role="tablist">
                        <li><a class="nav-item nav-link" id="nav-mat-copa-limpeza-higiene-tab" data-toggle="tab" href="#nav-mat-copa-limpeza-higiene" role="tab" aria-controls="nav-mat-copa-limpeza-higiene" aria-selected="true" onclick="UF_CrudPaginado.alteraCodigoNatureza('2.16.01', 'nav-mat-copa-limpeza-higiene')">Fornecedores</a></li>                        
                    </ul>
                </nav>  

                <input type="hidden" id="codigoNatureza" name="codigoNatureza"/>

                <div class="tab-content" id="nav-tabContent">
                    <div class="tab-pane fade div-content-tab" id="nav-mat-copa-limpeza-higiene" role="tabpanel" aria-labelledby="nav-mat-copa-limpeza-higiene-tab">                        
				    </div>

                    <div class="tab-pane fade div-content-tab" id="nav-mat-escritorio" role="tabpanel" aria-labelledby="nav-mat-escritorio-tab">                        
                    </div>

                    <div class="tab-pane fade div-content-tab" id="nav-mat-oper-sala-aula" role="tabpanel" aria-labelledby="nav-mat-oper-sala-aula-tab">
                    </div>

                    <div class="tab-pane fade div-content-tab" id="nav-uniform-funcs" role="tabpanel" aria-labelledby="nav-uniform-funcs-tab">                        
                    </div>
                </div>              
            </div>		           
        </div>
    </div>
</div>

<script type="text/javascript" src="/webdesk/vcXMLRPC.js"></script>
<script type="text/javascript" src="/${reposi}/resources/js/${reposi}.js?v=${versao}" charset="utf-8"></script>