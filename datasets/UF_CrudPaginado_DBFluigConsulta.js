/**
 *
 * @desc        Realiza consulta ao banco de dados do Fluig
 * @copyright   2021 upFlow.me
 * @version     1.0.0
 *
 * @param       {array String} fields - Deve-se informar um array os seguintes valores:
                                        INDEX0 = Cód de Sentença (Ex.: '3');
                                        INDEX1...n = Valores para campos de filtro nas querys;
 * @param       {array Constraint} constraints - Deve-se informar o objeto contendo todos os filtros necessários para exectar a consulta
 * @param       {array String} sortFields - Não utilizado. Informar null
 * @return      {dataset} Retorna o resultado da consulta com todas as colunas
 *
 */
 

function createDataset(fields, constraints, sortFields) {
    log.info('uf-log | Chamada do DataSet UF_DBFluigConsulta.js');

    // nome do datasource cadastrado no standalone.xml do Fluig
    var DATASOURCE = "jdbc/FluigDSRO";

    var QUERY = ""; // variável da query que será executada
    var CODSENTENCA = ""; // código de sentença que localiza a query
    var FILTROS = ""; // filtros que serão aplicados a query

    // resgata as variaveis passadas através do parâmetro fields do DataSet
    if (fields == null) return exibeErro('Parâmetro fields em branco.');
    if (fields[0] == '') return exibeErro('Parâmetro fields em branco. Informe o Cód. de Sentença.');

    // define o valor do código de sentença
    CODSENTENCA = fields[0];

    try {

        FILTROS = parseConstraints(constraints);

    } catch (e) {
        return exibeErro('Erro ao criar filtros (linha: ' + e.lineNumber + '): ' + e.message); // faz a chamada da função que exibe o erro
    }
    
    try {
        var CONSULTAINFO = lstConsulta[CODSENTENCA]; // consulta informações da sentença informada
        if (CONSULTAINFO == undefined) throw 'O Cód. de Sentença informado (' + CODSENTENCA + ') não é suportado pelo DataSet.';

        if(fields[0] == '5') {
            // informativo dos dados recebidos no log
            log.info("uf-log | Dados recebidos pelo dataset:");
            log.info("uf-log | DESCRIÇÃO: " + CONSULTAINFO.desc);
            log.info("uf-log | CODSENTENCA: " + CODSENTENCA);
            log.info("uf-log | CONSTRAINTS:");
            log.dir(constraints);
            log.info("uf-log | FIELDS:");
            log.dir(fields);
        }


    } catch (e) {
        return exibeErro('Erro nos parâmetros passados através do fields do DataSet: ' + e); // faz a chamada da função que exibe o erro
    }

    // cria a query de acordo com o filtro informado
    try {

        // se tem filtro específico no fields[n] envia para montar a query
        QUERY = CONSULTAINFO.query(FILTROS, fields);

    } catch (e) {
        return exibeErro('Erro ao criar query (linha: ' + e.lineNumber + '): ' + e.message); // faz a chamada da função que exibe o erro
    };

    try {

        var newDataset = DatasetBuilder.newDataset();
        var ic = new javax.naming.InitialContext();
        var ds = ic.lookup(DATASOURCE);
        var created = false;

    } catch (e) {
        return exibeErro('Erro ao criar acessar base (linha: ' + e.lineNumber + '): ' + e.message); // faz a chamada da função que exibe o erro
    }

    try {

        var conn = ds.getConnection();
        var stmt = conn.createStatement();

        // informativo da chamada no log
        log.info("uf-log | Executando consulta ao banco:");

        var rs = null; // variavel que receberá a resposta

		// faz a chamada para execução da query
		switch (String(CONSULTAINFO.tipo)) {
			case 'SELECT':

                log.info("uf-log | QUERY:");
                log.dir(QUERY);

				rs = stmt.executeQuery(QUERY);

				var columnCount = rs.getMetaData().getColumnCount();

				// loop no resultado criando as linhas do dataset
				while (rs.next()) {
					if (!created) {
						for (var i = 1; i <= columnCount; i++) {
							var column = rs.getMetaData().getColumnName(i);
							newDataset.addColumn(column);
						}
						created = true;
					}
					var Arr = new Array();
					for (var i = 1; i <= columnCount; i++) {
						var obj = rs.getObject(rs.getMetaData().getColumnName(i));
						if (null != obj) {
							Arr[i - 1] = rs.getObject(rs.getMetaData().getColumnName(i)).toString();
						}
						else {
							Arr[i - 1] = "null";
						}
					}
					newDataset.addRow(Arr);

                    if(fields[0] == '5') {
                        log.info("uf-log | ARR RESULTSET:");
                        log.dir(Arr);
                        // log.info("uf-log | newDataset RESULTSET:");
                        // log.dir(newDataset);
                    }

				}

				break;
				
			case 'UPDATE':

				rs = stmt.executeUpdate(QUERY);

				newDataset.addColumn("ERRO");
				newDataset.addColumn("MSG");
				newDataset.addColumn("DETALHES");

				if (isNaN(rs)) { // não é numérico
					newDataset.addRow(new Array(1, 'Ocorreu um erro ao realizar a atualização do registro!', rs));
				}
				else {

					if (rs >= '1') {
						newDataset.addRow(new Array(0, 'Foram atualizados ' + rs + ' registros!', null));
					}
					else {
						newDataset.addRow(new Array(0, 'Nenhum registro foi atualizado!', null));
					}

				}

				break;
			case 'INSERT':

				rs = stmt.executeUpdate(QUERY);

				newDataset.addColumn("ERRO");
				newDataset.addColumn("MSG");
				newDataset.addColumn("DETALHES");
				
				
				if (rs) {
					newDataset.addRow(new Array(0, 'Registro inserido com sucesso!', rs));
				}
				else {
					newDataset.addRow(new Array(1, 'Ocorreu um erro ao realizar a inclusão do registro!', rs));
				}

				break;
			case 'DELETE':

				rs = stmt.executeUpdate(QUERY);

				newDataset.addColumn("ERRO");
				newDataset.addColumn("MSG");
				newDataset.addColumn("DETALHES");

				if (isNaN(rs)) { // não é numérico
					newDataset.addRow(new Array(1, 'Ocorreu um erro ao realizar a remoção do registro!', rs));
				}
				else {

					if (rs >= '1') {
						newDataset.addRow(new Array(0, 'Foram removidos ' + rs + ' registros!', null));
					}
					else {
						newDataset.addRow(new Array(0, 'Nenhum registro foi removido!', null));
					}

				}

				break;
            case 'CREATE':

					stmt.addBatch(QUERY);
					rs = stmt.executeBatch();
					stmt.clearBatch();
	
					newDataset.addColumn("ERRO");
					newDataset.addColumn("MSG");
					newDataset.addColumn("DETALHES");
					
					
					if (rs) {
						newDataset.addRow(new Array(0, 'Tabela criada com sucesso!', rs));
					}
					else {
						newDataset.addRow(new Array(1, 'Ocorreu um erro ao realizar a inclusão do registro!', rs));
					}
	
					break;            
			default:
				return exibeErro('Erro ao criar acessar base (linha: ' + e.lineNumber + '): ', e.message); // faz a chamada da função que exibe o erro
        }
        
        // informativo do resultado da consulta
		log.info("uf-log | Chamada realizada com sucesso.");
		log.info("uf-log | -- Início do resultado \n" + rs);
		log.info("uf-log | -- Final do resultado");

    } catch (e) {
        if (stmt != null) stmt.close();
        if (conn != null) conn.close();
        return exibeErro('Erro ao executar a query (linha: ' + e.lineNumber + '): ' + e.message + '\n' + QUERY	); // faz a chamada da função que exibe o erro
    } finally {
        if (stmt != null) stmt.close();
        if (conn != null) conn.close();
    }

    return newDataset;

}

/**
 * @desc    Localiza, monta e retorna a query conforme cod. sentença e filtros informado
 */
var lstConsulta = {
    0: {
        tipo: 'SELECT',
        desc: 'Consulta de Teste',
        query: function(filtro, fields) {

            var _query = fields[1];

            return _query;
        },
    },    
    38: {
        tipo: 'INSERT',
        desc: 'Insere uma unidade na tabela ZUF_FORNECEDORES',
        query: function(filtro, fields) {
            var obj = JSON.parse(fields[1]);

            var _query = "INSERT INTO ZUF_FORNECEDORES ";
                _query += " (FORNECEDORNOME,FORNECEDORCNPJ,FORNECEDORNATUREZA,FORNECEDORATIVO) ";
                _query += " VALUES ";
                _query += " ('"+ obj.FORNECEDORNOME +"','"+ obj.FORNECEDORCNPJ +"','"+ obj.FORNECEDORNATUREZA +"','"+ obj.FORNECEDORATIVO +"')";
            return _query;
        },
    },
    39: {
        tipo: 'SELECT',
        desc: 'Retorna todas os fornecedores',
        query: function(filtro, fields) {   
            var parametros = JSON.parse(fields[1]);         

            var _query =  " SELECT *, " 
                _query += "     ( " 
                _query += "          SELECT COUNT(*) FROM ZUF_FORNECEDORES WHERE FORNECEDORNATUREZA = '"+ parametros.FORNECEDORNATUREZA +"'  " 

                if (parametros.SEARCH != "") {
                    _query += "             AND ( " 
                    _query += "                     FORNECEDORNOME LIKE '%"+parametros.SEARCH+"%' " 
                    _query += "                     OR "                     
                    _query += "                     FORNECEDORCNPJ LIKE '%"+parametros.SEARCH+"%' "                     
                    _query += "                  ) " 
                }

                _query += "          ORDER BY "+ parametros.ORDER +" "+ parametros.TYPE_ORDER +" " 
                _query += "     ) QTD_REGISTROS " 
                _query += " FROM ZUF_FORNECEDORES WHERE FORNECEDORNATUREZA = '"+ parametros.FORNECEDORNATUREZA +"' " 

                if (parametros.SEARCH != "") {
                    _query += " AND ( " 
                    _query += "         FORNECEDORNOME LIKE '%"+parametros.SEARCH+"%' " 
                    _query += "         OR "                     
                    _query += "         FORNECEDORCNPJ LIKE '%"+parametros.SEARCH+"%' "                     
                    _query += "     ) " 
                }
                
                _query += " ORDER BY "+ parametros.ORDER +" "+ parametros.TYPE_ORDER +" " 
                _query += " LIMIT "+ parametros.LIMIT +" OFFSET "+ parametros.OFFSET
            return _query;
        },
    },
    40: {
        tipo: 'SELECT',
        desc: 'Retorna as informações de um fornecedor',
        query: function(filtro, fields) {

            var parametros = JSON.parse(fields[1]);

            var _query = "SELECT * FROM ZUF_FORNECEDORES WHERE FORNECEDORID = '"+ parametros.FORNECEDORID +"' "
            return _query;
        },
    },
    41: {
        tipo: 'UPDATE',
        desc: 'Atualiza os dados do fornecedor',
        query: function(filtro, fields) {
            var parametros = JSON.parse(fields[1]);

            var _query  = " UPDATE ZUF_FORNECEDORES SET "; 
                _query += "     FORNECEDORNOME = '" + parametros.FORNECEDORNOME +"', ";            
                _query += "     FORNECEDORCNPJ = '" + parametros.FORNECEDORCNPJ +"' ";                                                                      
                _query += " WHERE FORNECEDORID = '" + parametros.FORNECEDORID + "' ";            

            return _query;
        },
    },
    42: {
        tipo: 'SELECT',
        desc: 'Retorna um fornecedor com determinado CNPJ e com id diferente do informado',
        query: function(filtro, fields) {

            var parametros = JSON.parse(fields[1])
            
            var _query  = " SELECT * FROM ZUF_FORNECEDORES ";            
                _query += " WHERE FORNECEDORCNPJ = '" +parametros.FORNECEDORCNPJ+ "' ";
                _query += " AND FORNECEDORID <> '" +parametros.FORNECEDORID+ "' ";
                _query += " AND FORNECEDORNATUREZA = '" +parametros.FORNECEDORNATUREZA+ "' ";
            
            return _query;
        },
    },
    43: {
        tipo: 'SELECT',
        desc: 'Retorna um fornecedor com determinado CNPJ',
        query: function(filtro, fields) {

            var parametros = JSON.parse(fields[1])
            
            var _query  = " SELECT * FROM ZUF_FORNECEDORES ";            
                _query += " WHERE FORNECEDORCNPJ = '" +parametros.FORNECEDORCNPJ+ "' ";   
                _query += " AND FORNECEDORNATUREZA = '" +parametros.FORNECEDORNATUREZA+ "' ";             
            
            return _query;
        },
    },  
    44: {
        tipo: 'DELETE',
        desc: 'Deleta um registro na tabela',
        query: function(filtro, fields) {

            var parametros = JSON.parse(fields[1]);
            var _query = " DELETE FROM ZUF_FORNECEDORES WHERE FORNECEDORID = '"+ parametros.FORNECEDORID +"' "
            return _query;
        },
    },
    45: {
        tipo: 'UPDATE',
        desc: 'BLOQUEIA/ATIVA USUARIO',
        query: function (filtros, cmpFiltro) {
            var parametros = JSON.parse(cmpFiltro[1]);
            
            var _query  = " UPDATE ZUF_FORNECEDORES SET ";
                _query += " FORNECEDORATIVO = '" + parametros.FORNECEDORATIVO + "' ";                                                      
                _query += " WHERE FORNECEDORID = " + parametros.FORNECEDORID;
            return String(_query).replace(/\s{2,}/g, ' ');
        }
    },    
    102: {
        tipo: 'CREATE',
        desc: 'Cria a tabela de fornecedores',
        query: function(filtro, fields) {
            // var _query = " CREATE TABLE ZUF_FORNECEDORES ( ";
            // _query += "    FORNECEDORID int(11) NOT NULL AUTO_INCREMENT,,  ";            
            // _query += "    FORNECEDORNOME VARCHAR(255) NOT NULL, ";
            // _query += "    FORNECEDORCNPJ VARCHAR(20) NOT NULL, ";            
            // _query += "    FORNECEDORNATUREZA VARCHAR(255) NOT NULL, ";
            // _query += "    FORNECEDORATIVO VARCHAR(255) NOT NULL, ";
            // _query += ") ";

            var _query = " CREATE TABLE `ZUF_FORNECEDORES` ( ";
            _query += " `FORNECEDORID` int(11) NOT NULL AUTO_INCREMENT, ";
            _query += " `FORNECEDORNOME` varchar(255) COLLATE utf8_bin NOT NULL, ";
            _query += " `FORNECEDORCNPJ` varchar(20) COLLATE utf8_bin NOT NULL, ";
            _query += " `FORNECEDORNATUREZA` varchar(255) COLLATE utf8_bin NOT NULL, ";
            _query += " `FORNECEDORATIVO` varchar(255) NOT NULL, ";            
            _query += " PRIMARY KEY (`FORNECEDORID`) ";
            _query += " ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_bin; ";

            return _query;
        },        
    },    
    103: {
        tipo: 'DROP',
        desc: 'Cria a tabela de fornecedores',
        query: function(filtro, fields) {          

            var _query = " DROP TABLE ZUF_FORNECEDORES; ";

            return _query;
        },        
    },    
    104: {
        tipo: 'SELECT',
        desc: 'DESCRIBE ZUF_FORNECEDORES',
        query: function(filtro, fields) {          

            var _query = " SELECT * FROM ZUF_FORNECEDORES ";

            return _query;
        },        
    },    
    105: {
        tipo: 'INSERT',
        desc: 'Insere uma unidade na tabela ZUF_FORNECEDORES',
        query: function(filtro, fields) {
            var obj = JSON.parse(fields[1]);

            var _query = "INSERT INTO ZUF_FORNECEDORES (FORNECEDORNOME,FORNECEDORCNPJ,FORNECEDORNATUREZA,FORNECEDORATIVO) VALUES ('Upflow.me','24.051.541/0001-07','2.16.01','S') ";
            return _query;
        },
    },
};


function buildFilter(objName, filters) {
    var query = "";
    if(typeof filters[String(objName)] == 'object') query = "AND " + objName + " IN ('" +filters[String(objName)].join("','")+ "') ";
    else if(typeof filters[String(objName)] == 'string') query = "AND " + objName + " = '" +filters[String(objName)]+ "' ";

    return query
}
/**
 * @desc    Transforma o conceito de constraints do Fluig para o Filtro da Query
 * @param   {array Constraint} constraints - Deve-se informar o objeto contendo todos os filtros necessários para chamar a query
 */
function parseConstraints(constraints) {

    // se não foi passado nenhum filtro, retorna filtro vazio
    if (constraints == null || constraints.length <= 0) return "1=1";

    var filtro = ""; // resultado final do filtro

    // percorre as constraints
    for (var i = 0; i < constraints.length; i++) {
        var con = constraints[i];

        // MUST: indicates that all Dataset records must meet this condition.
        // SHOULD: indicates that the Dataset records may or may not meet the condition. This type is more common when you need the same field to have values A or B (where each will be a search condition with type SHOULD).
        // MUST_NOT: indicates that none of the records can satisfy the condition.

        filtro += "(";

        if (con.getConstraintType() == ConstraintType.SHOULD) {

            filtro += "(" + con.getFieldName() + "=" + con.getInitialValue() + ")";
            filtro += " OR ";
            filtro += "(" + con.getFieldName() + "=" + con.getFinalValue() + ")";

        } else {

            if (con.getInitialValue() == con.getFinalValue()) {

                filtro += con.getFieldName();
                if (ConstraintType.MUST == con.getConstraintType()) filtro += " = ";
                if (ConstraintType.MUST_NOT == con.getConstraintType()) filtro += " <> ";
                filtro += con.getInitialValue();

            } else {

                filtro += con.getFieldName() + " BETWEEN " + con.getInitialValue() + " AND " + con.getFinalValue();

            }

        }

        filtro += ")"; // fecha constraints
        filtro += " AND "; // se for a última constraints, isso será retirado

    }

    // retorna a string retirando o último " AND "
    return filtro.substr(0, (filtro.length - 5));

}

/**
 * @desc    Exibe a mensagem de erro do console do Servidor e retorna uma coluna única com o erro para o usuário
 * @param   {string} msg - Mensagem de erro que será gravada no log e exibida ao usuário
 */
function exibeErro(msg) {
    if (msg == null || msg == '') msg = "Erro desconhecido, verifique o log do servidor."; // se mensagem de erro não foi definida
    var msgErro = msg; // incrementa a mensagem de erro vinda do código
    log.error('uf-log | ' + msgErro); // grava log no arquivo 'server.log' do JBOSS
    dataset = DatasetBuilder.newDataset(); // cria um novo DataSet para resposta do erro
    dataset.addColumn("ERRO"); // 1=Erro; 0=Sucesso
    dataset.addColumn("MSG"); // coluna com mensagem do erro para exibição ao usuário final
    dataset.addColumn("DETALHES"); // Mensagem detalhada a ser analisada pelo administrador
    dataset.addRow(new Array('1', 'Ocorreu um erro ao realizar na consulta ao servidor', msgErro)); // cria apenas uma linha com a mensagem de erro
    return dataset; // retorna o erro como resposta do DataSet
}
