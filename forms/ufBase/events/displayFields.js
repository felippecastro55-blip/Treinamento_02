/**
 *
 * @desc        Script padrão do Fluig para exibição do formulário (displayFields.js)
 *              Esse evento é disparado no momento em que os objetos do formulário são apresentados.
 * @copyright   2018 upFlow.me
 * @version     1.0.0
 * @author      Helbert Campos <helbert@upflow.me>
 *
 */

function displayFields(form, customHTML) {

    // cria objeto com os parâmetros do workflow e envia para o html
    var scp = "var infoWorkflow = {";
        scp += "WKDef:'"+getValue('WKDef')+"',";                    // Código do processo.
        scp += "WKVersDef:'"+getValue('WKVersDef')+"',";            // Versão do processo.        
        scp += "WKNumProces:'"+getValue('WKNumProces')+"',";        // Número da solicitação de processo.            
        scp += "WKNumState:'"+getValue('WKNumState')+"',";          // Número da atividade movimentada.        
        scp += "WKCurrentState:'"+getValue('WKCurrentState')+"',";  // Número da atividade atual.                
        scp += "WKCompany:'"+getValue('WKCompany')+"',";            // Número da empresa.        
        scp += "WKUser:'"+getValue('WKUser')+"',";                  // Código do usuário corrente.
        scp += "WKCompletTask:'"+getValue('WKCompletTask')+"',";    // Se a tarefa foi completada (true/false).                
        scp += "WKNextState:'"+getValue('WKNextState')+"',";        // Número da próxima atividade (destino).            
        scp += "WKCardId:'"+getValue('WKCardId')+"',";              // Código do formulário do processo.    
        scp += "WKFormId:'"+getValue('WKFormId')+"',";              // Código da definição de formulário do processo.    
    scp += "};"
    customHTML.append("<script type='text/javascript'>"+scp+"</script>");

    // envia a variável (string) para o HTML com o modo de edição do formulário
	customHTML.append("<script type='text/javascript'>var modForm = '"+form.getFormMode()+"';</script>");

    log.info('### uf-log | Início displayFields(WKNumProces: '+getValue('WKNumProces')+', WKNumState: '+getValue('WKNumState')+', modForm: '+form.getFormMode()+', WKUser: '+getValue('WKUser')+') ###');
    
    var NumState = parseInt(getValue('WKNumState'));
    
    // executa uma ação de acordo com o modo do formulário
    switch ( String(form.getFormMode()) ) {
        case 'ADD':     // indicando modo de inclusão
            
            
            break;
        case 'MOD':     // indicando modo de edição
            
            // resgata informações do usuário logado
            var filter = new java.util.HashMap();
            filter.put('colleaguePK.colleagueId', getValue('WKUser'));
            var usuario = getDatasetValues('colleague', filter);    // variável com dados do usuário logado
            
            // verifica as condições temporais do processo (apenas uma é atendida)
            switch (true) {};
            
            
            break;
        case 'VIEW':    // indicando mode de visualização
            
            
            break;
        case 'NONE':    // indicando que não há comunicação com o formulário

            break;
        default:

    };
    
    // leva as informações do status para o front-end
    var statusAtivAtual = lstAtiv[1];
    if (form.getFormMode() != 'ADD') statusAtivAtual = lstAtiv[getValue('WKNumState')];
    //form.setValue('STATUSCOD', getValue('WKNumState'));
    //form.setValue('STATUS', statusAtivAtual.tit);
    customHTML.append("<script type='text/javascript'>var ufStatus = "+JSON.stringify(statusAtivAtual)+";</script>");
    
    log.info('### uf-log | Final displayFields(WKNumProces: '+getValue('WKNumProces')+', WKNumState: '+getValue('WKNumState')+', modForm: '+form.getFormMode()+', WKUser: '+getValue('WKUser')+') ###');
}