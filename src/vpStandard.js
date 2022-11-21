// ==UserScript==

// @name         VpFuego

// @description  Opti Vp dans le rouge

// @author       Fuego

// @grant        none

// @include      http://*.grepolis.com/game/*

// @include      https://*.grepolis.com/game/*

// @icon         https://cdn.discordapp.com/attachments/852734145582071839/852734152939012126/unknown.png

// @version      1.0.0

// ==/UserScript==



function farm() {



	//########################################

	// Variables

	//########################################



	var pause = 1750;



	var farmMode = 12; //EN MINUTES 10 !! 40 !! 160



	var tempsMini = 1;

	var tempsMaxi = 45;



	var switchVp = "off";

	var tempsAlea = 0;

	var delayNextVP = 0;



	//########################################

	//	Exécution du script

	//########################################



	createUIFarm();

	var startBotVP = document.getElementById('startBot');

    startBotVP.addEventListener("click", toggleAutoFarm, false);



	//########################################

	//	Functions

	//########################################



	function toggleAutoFarm (event) {

        if(event.target.classList.contains('checked')) {

            event.target.classList = 'checkbox';

            switchVp = 'off';

			document.querySelector(".textCheck").innerHTML = "Farming Off";

        }else{

			event.target.classList = 'checkbox checked';

			switchVp ='on';

			document.querySelector(".textCheck").innerHTML = "Farming On";

			loopVP();

        }

    }



	function loopVP(){

		tempsAlea = createTempsAlea(tempsMini, tempsMaxi);

		delayNextVP = (60 * farmMode + tempsAlea)*1000;

		var farmVP = new Promise((resolve, reject) => {

			setTimeout(() => {

				recupVP(resolve);

			},100);

		});

		farmVP.then((value) => {

			console.log(value);

			waitVP(delayNextVP);

		});

	}



	function waitVP(delayNextVP){

		var farmTime = Date.now() + delayNextVP;

		var interval = 1500;



		var sleep = new Promise((resolve, reject) => {

			var timerVP = setInterval(function(){

				if(Date.now()>farmTime){

					resolve("Début du Farming");

					clearInterval(timerVP);

				}

				if (switchVp == "off"){

					reject("switchVP est passé en off");

				}

			},interval);

		});

		sleep.then((value) => {

			console.log("------------------------------");

			console.log(value);

			loopVP();

		});

	}



    function recupVP(finishFarm){

		showCurtain();

		var curtainActivated = new Promise((resolve, reject) => {

			setTimeout(() => { //Ouvre l'aperçu "Villages de paysans" si nécéssaire

				var all_cities = document.querySelector("#fto_town_wrapper div div.game_header.bold span a");

				if (all_cities == null) {

					console.log("Ouverture de l'interfaces des villages paysans.");

					document.querySelector("#overviews_link_hover_menu div.box.middle.left div div ul li.subsection.captain.enabled ul li.farm_town_overview a").click();

				}

				setTimeout(function() {

					//Clique sur "Tout sélectionner"

					document.querySelector("#fto_town_wrapper div div.game_header.bold span a").click();

					//Séléction du temps

					setTimeout(() => {

						if (farmMode != 10) {

							console.log('smiley');

							setTimeout(choiceMode(farmMode), pause);

						}

					},pause);

					clickRessources(resolve);

				}, pause);

			},pause);

		})

		curtainActivated.then((value) => {

			console.log(value);

			setTimeout(function() {

				hideCurtain();

			},750);

			//Prommesse farmVP est tenue

			finishFarm("Phase D'attente");

		});

	}



	function clickRessources(resolve){

		setTimeout(function() {

			document.querySelector("#fto_claim_button div.caption.js-caption").click();

			setTimeout(function() {

				//document.querySelector('.btn_confirm div:nth-child(3)').click();



				console.log('Récolte des paysans effectué à : ', Date());



				document.querySelector(".decompte").innerHTML = "récolte effectué à : " + Date().substring(16, 24);

				document.querySelector(".addTemps").innerHTML = "Temps farmé : " + farmMode + "min";



				console.log(tempsAlea);

				var strTpsAlea = tempsAlea.toString();

				if (strTpsAlea.length == 4) {

					document.querySelector(".addAlea").innerHTML = "temps random ajouté : " + strTpsAlea.substring(0,1) + "s";

				} else {

					document.querySelector(".addAlea").innerHTML = "temps random ajouté : " + strTpsAlea.substring(0,2) + "s";

				}

				console.log("Temps Aleatoire:" + tempsAlea);

				console.log("Temps du farm :" + farmMode);



				closeVP();



				setTimeout(() => {resolve('Farming Finit');},pause);

			}, pause);

		}, pause);

	}



	function choiceMode(farmMode){

		if (farmMode == 40) {

			document.querySelector("#farm_town_options div.fto_time_checkbox.fto_2400 a.checkbox").click();

			}

		else if (farmMode == 160) {

			document.querySelector("#farm_town_options div.fto_time_checkbox.fto_10800 a.checkbox").click();

		}

	}



	function createTempsAlea(tempsMini, tempsMaxi){

		//Génère un temps aléatoire en ms, entre "tempsMini" et "tempsMaxi" en ms

		var tempsAlea = Math.floor(Math.random() * (tempsMaxi - tempsMini)) + tempsMini;

		return tempsAlea;

	}



	function closeVP() {

        var vp = document.getElementsByClassName('ui-dialog-titlebar-close')[0].children[0];

        console.log(vp);

        vp.click();

    }



	//########################################

	//	UI Création

	//########################################



	function createUIFarm(){

		createCurtain();

		createElt();

	}



	function createCurtain(){

		var css = "height: 100%; position: fixed; z-index: 8000; top: 0px; left: 0px; background-color: rgba(0, 0, 0, 0.6); width: 100%; visibility: hidden;";

		var curtain = document.createElement("div");

		curtain.setAttribute("id", "curtain_farm");

		curtain.setAttribute("style", css);

		document.body.append(curtain);

	}



	function createElt(){

		var css = "position: absolute; bottom: 40px; left: 40px; background-color: rgba(245, 208, 66, 0.9); z-index: 2; padding: 20px;";

		var elt = document.createElement("div");

		elt.setAttribute("id", "UI_decompte");

		elt.setAttribute("style", css);

		document.body.append(elt);



		var divCheck = document.createElement("div");

		divCheck.className = "divCheck";



		var addAlea = document.createElement("div");

		addAlea.className = "addAlea";



		var addTemps = document.createElement("div");

		addTemps.className = "addTemps";



		var decompte = document.createElement("div");

		decompte.className = "decompte";



		elt.appendChild(divCheck);

		elt.appendChild(decompte);

		elt.appendChild(addAlea);

		elt.appendChild(addTemps);



		createCheckboxVP(divCheck);

	}





	function createCheckboxVP(divCheck) {

        var css = "";

        var checkbox = document.createElement("a");

        checkbox.className = "checkbox";

        checkbox.setAttribute("id", "startBot");

        checkbox.setAttribute("style", css);

        divCheck.appendChild(checkbox);



		var css2 = "";

        var textCheck = document.createElement("div");
        var img2ouf = new Image();
        img2ouf.src = "https://fr149.grepolis.com/image.php?player_id=848924830&729"
        textCheck.appendChild(img2ouf);
        textCheck.className = "textCheck";

        textCheck.setAttribute("id", "textCheck");

        textCheck.setAttribute("style", css2);

		textCheck.append('Poule Farm Premium')

		divCheck.appendChild(textCheck);

    }



	function showCurtain() {

		var showcurtain = document.getElementById('curtain_farm');

		showcurtain.style.visibility = "visible";

		console.log("Curtain " + showcurtain.style.visibility);

	}



	function hideCurtain() {

		var hidecurtain = document.getElementById('curtain_farm');

		hidecurtain.style.visibility = "hidden";

		console.log("Curtain " + hidecurtain.style.visibility);

	}



	console.log("NerissVP_Beta est chargé :)");

}

farm();



/*	PROMISES



	const promise1 = new Promise((resolve, reject) => {

		setTimeout(() => {

			resolve('foo');

		}, temps);

	});



	promise1.then((value) => {



	});

*/
