/**
 * Objeto de manipulação de exibição de alertas e notificações ao usuário
 */
 var uFNotify = {
	loading: function (msg) {
		let msgLoading = FLUIGC.loading(window, {
			textMessage: msg,
			overlayCSS: {
				"border-radius": '6px',
				opacity: 0.6,
				cursor: 'wait'
			},
			baseZ: 1000,
			fadeIn: 200,
			fadeOut: 400,
			timeout: 0,
		});
		
		return msgLoading;
	},

	// alerta de erro
	alertErro: function (err) {
		return Swal.fire({
			title: 'Algo deu errado :(',
			html: `Ocorreu um erro inesperado, para mais detalhes contate um administrador. <hr> <h5> ${err}</h5>`,
			type: 'error',
			confirmButtonColor: '#d33',
			confirmButtonText: 'Voltar',
			showCancelButton: false,
			allowOutsideClick: false,
			allowEscapeKey: false,
		}).then((result) => {
			if (result.value) {
				window.location.reload();
			}
		});
	},
	
	notiInfo: function (msg) {
		Swal.fire({
            icon: 'info',
            title: '',
            text: msg,
            footer: ''
        })
	},
	
	notiSuccess: function (msg) {
		Swal.fire({                                        
			icon: 'success',
			title: msg,
			showConfirmButton: false,
			timer: 1500
		});
	},
	
	notiError: function (msg) {
		Swal.fire({
			icon: 'error',
			title: 'Oops...',
			html: msg,
			footer: ''
		});
	},
	notiSuccessMini: function (msg) {
		const Toast = Swal.mixin({
			toast: true,
			position: 'top-end',
			showConfirmButton: false,
			timer: 3000,
			timerProgressBar: true,
			didOpen: (toast) => {
			  toast.addEventListener('mouseenter', Swal.stopTimer)
			  toast.addEventListener('mouseleave', Swal.resumeTimer)
			}
		  })
		  
		  Toast.fire({
			icon: 'success',
			title: msg
		  })
	},
	
};