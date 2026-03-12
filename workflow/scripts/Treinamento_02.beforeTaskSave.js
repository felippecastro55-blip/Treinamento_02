function beforeTaskSave(colleagueId, nextSequenceId, userList) {
    var attachments = hAPI.listAttachments();
    var hasAttachment = false;

    for (var i = 0; i < attachments.size(); i++) {
        var attachment = attachments.get(i);
        if (attachment.getDocumentDescription() == "Cotacao") {
            hasAttachment = true;
        }
    }

    if (!hasAttachment) {
        throw 'Erro: nome do arquivo anexado deve ser "Cotacao"';
    }

    var atvAtual = getValue('WKCurrentState');
    log.info("Executou before")

    if (atvAtual == 1) {
        log.info("Executou condição")
        var campoValorTotal = hAPI.getCardValue("VALORTOTAL");
        var campoFormatado = parseReais(campoValorTotal);
        log.info("valor do campo agora");
        //log.info(campoValorTotal)

        if (campoFormatado > 100000) {
            log.info("atendeu condição valor total")
            throw "O valor total dos produtos não pode passar de R$ 100.000,00."
        }
    }

    //Verificação tipo de pagamentos
}
/* var teste = "teste"
log.info(teste)
function parseReais (campo) {
    // retira os pontos, depois troca a vírgula por ponto
    var valor = campo.replace(/\./g,"").replace(",",".");
    return Number(valor.replace(/[^0-9\.]/g, ""));
} */
function parseReais(valor) {
    if (valor === null || valor === undefined) return 0;

    // garante string JS (mesmo que venha java.lang.String)
    var s = String(valor).trim();
    if (!s) return 0;

    // remove R$, espaços, etc. Mantém dígitos, ponto, vírgula e sinal
    s = s.replace(/[^\d.,-]/g, "");

    // remove separador de milhar "." e troca decimal "," por "."
    s = s.replace(/\./g, "").replace(/,/g, ".");

    var n = Number(s);
    return isNaN(n) ? 0 : n;
}

