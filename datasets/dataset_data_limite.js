
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
        dataSelecionada.reverse();

        /* Criando objeto date para calcular */
        var dataSelecionadaFormatada = new Date(dataSelecionada[0], dataSelecionada[1], dataSelecionada[2]);
        var dataAtt = "";
        if (dataSelecionadaFormatada.getDate() >= dataAtual.getDate() + 10) {
            log.info('data selecionada maior ou igual a 10 dias da data atual')

            if (dataSelecionada.getMonth() === dataAtual.getMonth()) {
                log.info('data selecionada ta no mesmo mês que Data atual.');
                dataSelecionadaFormatada.setMonth(dataSelecionadaFormatada.getMonth() + 1);
                dataSelecionadaFormatada.setDate(dataSelecionadaFormatada.getDate() + 1);
                dataAtt = String(dataSelecionadaFormatada.getDate()).padStart(2,'0') + '/' + String(dataSelecionada.getMonth()).padStart(2,'0') + '/' + dataSelecionada.getFullYear();
                log.info(dataAtt);
                dataset.addRow(["0", "SUCESSO", dataAtt]);
            };
        };


        dataset.addRow(["1", "SUCESSO", dataAtt]);

    } catch (error) {
        dataset.addRow(["1", "ERRO", error]);
    }
    return dataset;
}