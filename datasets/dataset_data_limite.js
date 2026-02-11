
function createDataset(fields, constraints, sortFields) {
    log.info("dataset funcionando")
    var dataset = DatasetBuilder.newDataset();

    dataset.addColumn("ERRO");
    dataset.addColumn("MSG");
    dataset.addColumn("DETALHES");
    try {


        var dataAtual = new Date();
        var dataSelecionada;


        /* Pegando valores do front-end para processar e construir o dataset */
        if (fields !== null) {
            dataSelecionada = fields[0];
        };

        /* Formatando data inicial no padrão EUA */
        dataSelecionada = dataSelecionada.split("/");


        /* Criando objeto date para calcular */
        var dataSelecionadaFormatada = new Date(dataSelecionada[2], dataSelecionada[1] - 1, dataSelecionada[0]);
        dataSelecionadaFormatada.setHours(0, 0, 0, 0);

        var dataAtt = "";

        var prazoMinimoDias = new Date();
        prazoMinimoDias.setDate(dataAtual.getDate() + 10);
        prazoMinimoDias.setHours(0, 0, 0, 0);
        
        var ultimoDiaMes = new Date(dataAtual.getFullYear(), dataAtual.getMonth() + 1, 0);

        log.info("Rodou ate aqui")


        if (dataSelecionadaFormatada > ultimoDiaMes) {
            log.info('Data selecionada tem o mês posterior e ano igual ou maior que o da data atual.');
            if (dataSelecionadaFormatada >= prazoMinimoDias) {
                dataAtt = dataSelecionada[0] + "/" + dataSelecionada[1] + "/" + dataSelecionada[2]
                log.info(dataAtt)
                log.info('Data selecionada 10 ou mais dias a mais que data atual.');
                dataset.addRow(["0", "SUCESSO", dataAtt]);
            } else {
                log.info('Data selecionada tem menos de 10 dias da data atual');
                dataset.addRow(["1", "ERRO", dataAtt]);
            }
        } else {
            log.info('Data selecionada é menor do que a data atual');
            dataset.addRow(["1", "ERRO", dataAtt]);
        };

    } catch (error) {
        log.info('erro catch')
        dataset.addRow(["1.1", "ERRO", error.message]);
    }
    return dataset;
}