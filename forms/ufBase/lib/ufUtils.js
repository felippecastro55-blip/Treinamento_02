/**
 * Funções de utilização recorrente em projetos de desenvolvimento de
 * frontend em Fluig da upFlow.me
 * 
 * @file        ufUtils.js
 * @copyright   2018 upFlow.me
 * @version     1.0.0
 * @author      Fernando Alves <fernando@upflow.me>
 * @company     upFlow.me
 */

const ufUtils = {
    /**
     * Implementa funções de utilação recorrente para manipulação de datas.
     */
    DATA : {
        /**
         * Retorna a data atual do sistema.
         * 
         * @since    1.0.0
         * @returns  data atual
         */
        getDataAtual : function () {
            return moment().format('DD/MM/YYYY');
        }
    }
}