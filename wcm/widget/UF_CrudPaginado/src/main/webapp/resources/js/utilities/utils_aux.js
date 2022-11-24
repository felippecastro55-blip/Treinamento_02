var UTILS_AUX = SuperWidget.extend({
	addLoader: function(message) {
		$('.js-loading-container').removeClass('hide');
		$('.js-loading-container').find('.js-loader-message').html(message)
	},
	removeLoader() {
		$('.js-loading-container').addClass('hide');
	},
	rangeDates: function(initialDate, finalDate, days) {
		return new Promise(function(resolve, reject){
			var objectDate = {}
			var arrayDates = []
			
			objectDate.initial = moment(initialDate, 'DD/MM/YYYY').format('MM-DD-YYYY');
			objectDate.final = moment(finalDate, 'DD/MM/YYYY').format('MM-DD-YYYY');
			
			var start = new Date(objectDate.initial);
			var end = new Date(objectDate.final);
			
			while(start <= end){
			   if (days.includes(moment(start).format('ddd'))) {
			       arrayDates.push(moment(start).format('DD/MM/YYYY'));
			   }
			
			   var newDate = start.setDate(start.getDate() + 1);
			   start = new Date(newDate); 
			}
			
			resolve(arrayDates);
		});
	},
	isMobile: function() {
		return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
	},
	progressValue: function(){  
	  $('.progress-bar').each(function(){    
	    var positionProgressValue = $(this).children('.progress-value').css('left','auto');
	    var progressBarValue = $(this).children('.progress-value').html();    
	    $(this).width(progressBarValue);    
	    if($(this).width() < 21){
	      positionProgressValue.css('left','0');
	    }    
	  });
	},
	convertMinutesToHours: function(n) {
		var num = n;
		var hours = (num / 60);
		var rhours = Math.floor(hours);
		var minutes = (hours - rhours) * 60;
		var rminutes = Math.round(minutes);
		var mountReturn = `${rhours > 9 ? rhours : `0${rhours}`}:${rminutes > 9 ? rminutes : `0${rminutes}` }`;
		
		return mountReturn;
	},
	isEmpty: function(value) {
		return value == null || value == "" || value == undefined || value == 'undefined';
	},
	verifyRangeDate: function($this, element) {
		var horaInicio = $(element.currentTarget).data('horainicio');
		var horaFim = $(element.currentTarget).data('horafim');
		var data = $(element.currentTarget).data('dataevent');
		var hora = $(element.currentTarget).val();
		
		if ( 
			moment(`${data} ${hora}`, "DD/MM/YYYY HH:mm").valueOf() < moment(`${data} ${horaInicio}`, "DD/MM/YYYY HH:mm").valueOf() ||
			moment(`${data} ${hora}`, "DD/MM/YYYY HH:mm").valueOf() > moment(`${data} ${horaFim}`, "DD/MM/YYYY HH:mm").valueOf()
		) {
			$($this).val("");
			FLUIGC.toast({
                title: 'Ops!',
                message: `O horario de inicio deve ser maior que ${horaInicio} e menor que ${horaFim}`,
                type: 'warning'
            });
		}
	},
	initDataTables: function(table) {
		$(document).ready(function() {
		    return table.DataTable({
				order: [[ 0, "asc" ]],
				language:{
			        "sEmptyTable": "Nenhum registro encontrado",
			        "sInfo": "Mostrando de _START_ até _END_ de _TOTAL_ registros",
			        "sInfoEmpty": "Mostrando 0 até 0 de 0 registros",
			        "sInfoFiltered": "(Filtrados de _MAX_ registros)",
			        "sInfoPostFix": "",
			        "sInfoThousands": ".",
			        "sLengthMenu": "_MENU_ resultados por página",
			        "sLoadingRecords": "Carregando...",
			        "sProcessing": "Processando...",
			        "sZeroRecords": "Nenhum registro encontrado",
			        "sSearch": "Pesquisar",
			        "oPaginate": {
				            "sNext": "Próximo",
				            "sPrevious": "Anterior",
				            "sFirst": "Primeiro",
				            "sLast": "Último"
				        },
				        "oAria": {
				            "sSortAscending": ": Ordenar colunas de forma ascendente",
				            "sSortDescending": ": Ordenar colunas de forma descendente"
				        }
			    	},
				dom: 'Bfrtip',
		        buttons: [
		            // 'excelHtml5',
		            // 'csvHtml5',
		            // 'pdfHtml5'
		        ]
			})
		});
	},

	languageDataTable: function(){
		return {
			"sEmptyTable": "Nenhum registro encontrado",
			"sInfo": "Mostrando de _START_ até _END_ de _TOTAL_ registros",
			"sInfoEmpty": "Mostrando 0 até 0 de 0 registros",
			"sInfoFiltered": "(Filtrados de _MAX_ registros)",
			"sInfoPostFix": "",
			"sInfoThousands": ".",
			"sLengthMenu": "_MENU_ resultados por página",
			"sLoadingRecords": "Carregando...",
			"sProcessing": "Processando...",
			"sZeroRecords": "Nenhum registro encontrado",
			"sSearch": "Pesquisar",
			"oPaginate": {
				"sNext": "Próximo",
				"sPrevious": "Anterior",
				"sFirst": "Primeiro",
				"sLast": "Último"
			},
			"oAria": {
				"sSortAscending": ": Ordenar colunas de forma ascendente",
				"sSortDescending": ": Ordenar colunas de forma descendente"
			}
		}
	},

	initDataTableWithPagination: function(table, data, consulta, colunas) {
		
		return table.DataTable({
			responsive: true,
			serverSide: true,
			order: [[ 0, "asc" ]],
			language: UTILS_AUX.languageDataTable(),			
			columns: colunas,
			ajax: {
				url: '/api/public/ecm/dataset/datasets/',
				type: 'POST',
				dataType: 'json',
				headers: { "Content-Type": "application/json" },				
				dataFilter: function(data){
					var json = jQuery.parseJSON( data );
					json.recordsTotal = json?.content?.values[0]?.QTD_REGISTROS;
					json.recordsFiltered = json?.content?.values[0]?.QTD_REGISTROS;
					json.data = json.content.values;
		 
					return JSON.stringify( json ); // return JSON string
				},
				data: function (d) {				

					data["OFFSET"] =  d.start;
					data["LIMIT"] =  d.length;
					data["SEARCH"] =  d.search.value;
					data["ORDER"] = d.columns[d.order[0].column].data;
					data["TYPE_ORDER"] = d.order[0].dir;
					
					var objAPI = {
						name: "UF_CrudPaginado_DBFluigConsulta",
						fields: [consulta, JSON.stringify(data)],
						constraints: null,
						order: null
					};                    
					return JSON.stringify(objAPI);
				
				},
			}
		})
	
	},
	substringMatcher: function(strs) {
        return function findMatches(q, cb) {
            var matches, substrRegex;

            matches = [];

            substrRegex = new RegExp(q, 'i');

            $.each(strs, function(i, str) {
                if (substrRegex.test(str)) {
                    matches.push({
                        description: str
                    });
                }
            });
            cb(matches);
        };
    },

	/**
	 * Pega um dataset
	 *
	 * Wrapper para tornar a DatasetFactory.getDataset em Promise.
	 *
	 * @param {string} dataset Nome do Dataset
	 * @param {string[]} fields Campos para retornar (pode ser null pra retornar todos)
	 * @param {Constraint[]} constraints Os filtros a aplicar ou null se não filtrar nada
	 * @param {string[]} sorters Campos para ordenar ou null para não ordenar. Pode colocar ;desc no campo para ordenar decrescente
	 * @returns {Promise} Resolve com o objeto dataset {columns: string[], values: string[]}
 	 */
	getDataset: function(dataset, fields, constraints, sorters) {
		return new Promise(function (resolve, reject) {
			DatasetFactory.getDataset(
				dataset,
				fields,
				constraints,
				sorters,
				{
					success: data => resolve(data),
					error: () => reject(arguments)
				}
			);
		});
	},
	isJson: function(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
    
        return true;
    },
    getDados: function(p){
        if(typeof p == 'object'){
           if(p.dataset){
               if(p.filtros != null){
                  var f = new Array();
                   for(i = 0; i < p.filtros.length; i++){
                       var tipo = p.filtros[i].tipo;
                           if(tipo == "MUST"){
                               tipo = ConstraintType.MUST;
                           }else if(tipo == "SHOULD"){
                               tipo = ConstraintType.SHOULD;
                           }else{
                               tipo = ConstraintType.MUST_NOT;
                           }
                           
                       f.push(
                           DatasetFactory.createConstraint(
                               p.filtros[i].campo,
                               p.filtros[i].initial,
                               p.filtros[i].final,
                               tipo,
                               p.filtros[i].like
                           )
                       );
                   }
               }else{
                   var f = p.filtros;
               }
               try{
                   return DatasetFactory.getDataset(p.dataset,p.campos,f,p.ordem);
               }catch(e){
                   throw e;
               }
           }else{
               FLUIGC.toast({
                   title:"Ops!",
                   message:"Dataset Não Encontratdo",
                   type:"danger" 
               });
           }            
       }else{
           FLUIGC.toast({
               title:"Ops!",
               message:"Parametros inválidos",
               type:"danger" 
           });
       }
    },
	replaceAll: function(str, de, para) {

		var pos = str.indexOf(de);
		while (pos > -1) {
			str = str.replace(de, para);
			pos = str.indexOf(de);
		}
		return (str);
	},
	blinkText: function () {
        $(".blink").fadeOut(500);
        $(".blink").fadeIn(500);
    },
	/**
	* faz a validação de um dígito verificador
	* @param {[number]} digits array com os dígitos do CNPJ
	* @param {number} validating checa se valida o primeiro ou o segundo dígito
	* @returns {boolean}
	*/
	digitValidation: function(digits, validating){
		const digitRange = validating + 11
		const verifArr = validating === 2 ? [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
		const digitSum = digits.slice(0, digitRange).map((value, index) => value * verifArr[index]).reduce((acc, cur) => acc + cur)
		const result = (digitSum * 10) % 11
		return result >= 10 ? digits[digitRange] === 0 : digits[digitRange] === result
		},
	/**
	* avalia se um CNPJ é válido ou não
	* @param {*} element seletor JQUERY
	* @returns {true | Error}
	*/
	validaCNPJ: function(element) {
		 const cnpjString = element.val()
	 
		 if (!UTILS_AUX.isEmpty(cnpjString)) {
		   const digits = String(cnpjString).replace(/[./-]/g, '').split('').map(val => Number(val))
		   const errorType = !(digits.length === 14) ? 'CNPJ Inválido: CNPJ com quantidade inválida de dígitos' :
			 !(UTILS_AUX.digitValidation(digits, 1)) ? 'CNPJ Inválido: Falha no primeiro dígito verificador' :
			   !(UTILS_AUX.digitValidation(digits, 2)) ? 'CNPJ Inválido: Falha no segundo dígito verificador' :
				 null
	 
		   return errorType ? false : true
		 }
		 return true
	},
	valorSQL: function(valor) {

		var valorSql = UTILS_AUX.replaceAll(valor, '.', '');

		valorSql = UTILS_AUX.replaceAll(valorSql, ',', '.');

		valorSql = UTILS_AUX.replaceAll(valorSql, 'R$ ', '');
		
		return valorSql;
	},  
	valorHtml: function(valorSQL) {

		var valor = parseFloat(valorSQL);

		if (!isNaN(valor)) {
			valor = valor.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
			if (!UTILS_AUX.isEmpty(valor)) {
				valor = valor.replace("R$", "");
				valor = valor.trim();
			}
			return valor;
		} else {
			return '';
		}
	},  
	valorMonetario: function(valorSQL) {

		var valor = parseFloat(valorSQL);

		if (!isNaN(valor)) {
			return valor.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
		} else {
			return '';
		}
	},
	getDBFluigConsulta(data,codigoConsulta, loading, sucessCallBack, errorCallBack) {	

        return new Promise(function (resolve, reject) {           
        
            DatasetFactory.getDataset('UF_CrudPaginado_DBFluigConsulta', [codigoConsulta, JSON.stringify(data)], null, null, {

                success: function(content){
					console.info('RESPOSTA vcXMLRPC com sucesso New', content);

					if (sucessCallBack != "") {
						sucessCallBack(content);
					} else {	
						if (content.values && content.values.length) {
	
							if (content.values[0]['ERRO'] == '1') {
								console.error('O DataSet UF_CrudPaginado_DBFluigConsulta foi executado, mas retornou um erro: ' + content.values[0]['DETALHES']);
								loading.hide();
								uFNotify.notiError('O DataSet UF_CrudPaginado_DBFluigConsulta foi executado, mas retornou um erro:</br>' + content.values[0]['DETALHES']);
								resolve(false);
							} else {
								if (content != null && content.values != null && content.values.length > 0) {
									resolve(content.values);
								} else {
									resolve(false);
								}                        
							}
						} else {
							resolve(false);
						}
					}

                },
                error: function(jqXHR, textStatus, errorThrown) {    
					if (errorCallBack != "") {
						errorCallBack(content);
					} else {	                            
						console.error('RESPOSTA vcXMLRPC com erro', jqXHR, textStatus, errorThrown);
						loading.hide();
						var msg = jqXHR.responseJSON.message;   // resgata a mensagem de erro real que acorreu com o DataSet
						uFNotify.notiError('Houve um erro ao realizar consulta ao dataset UF_CrudPaginado_DBFluigConsulta.<br>Detalhes: ' + msg);
						reject(false);
					}
                },
            });
        });
    }  
});