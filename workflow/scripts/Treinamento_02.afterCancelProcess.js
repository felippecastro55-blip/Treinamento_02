function afterCancelProcess(colleagueId,processId){
	log.dir('### uf-log | Início Treinamento_02.afterCancelProcess.js ###');
	
	// Caso a solicitação seja cancelada no meio de uma atividade atualiza para este status
	hAPI.setCardValue("STATUSCOD", '0');
    hAPI.setCardValue("STATUS", 'Cancelado');
    
    log.info('### uf-log | Fim da Chamada do Treinamento_02.afterCancelProcess.js ###')
	
}