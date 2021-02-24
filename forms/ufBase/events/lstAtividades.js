/**
 *
 * @desc        Lista de atividades/status do workflow
 * @copyright   2018 upFlow.me
 * @version     1.0.0
 * @author      Helbert Campos <helbert@upflow.me>
 *
 */

// tit ==> título
// des ==> descrição
// cbk ==> cor do background
// cfn ==> cor da fonte
// ico ==> ícone do fluig style guide

lstAtiv = {
    0: {
        tit: 'Cancelado',
        des: 'Atividade foi cancelada e não poderá ser reaberta.',
        cbk: '#B71C1C',
        cfn: '#FFEBEE',
        ico: '<span class="fluigicon fluigicon-remove-circle"></span>',
    },
    1: {
        tit: 'Início',
        des: 'Atividade está em preenchimento de formulário.',
        cbk: '#757575',
        cfn: '#F5F5F5',
        ico: '<span class="fluigicon fluigicon-add-test"></span>',
    },
    2: {
        tit: 'Em Execução',
        des: 'Atividade em andamento utilizando os materiais e mão-de-obra definidos.',
        cbk: '##2E7D32',
        cfn: '#E8F5E9',
        ico: '<span class="fluigicon fluigicon-test-refresh"></span>',
    },
    4: {
        tit: 'Solicitação Finalizada',
        des: 'Solicitação foi encerrada com sucesso.',
        cbk: '#2E7D32',
        cfn: '#E8F5E9',
        ico: '<span class="fluigicon fluigicon-check-circle-on"></span>',
    },
    6: {
        tit: 'Solicitação cancelada',
        des: 'Solicitação não foi aprovada.',
        cbk: '#B71C1C',
        cfn: '#FFEBEE',
        ico: '<span class="fluigicon fluigicon-check-circle-on"></span>',
    },
}