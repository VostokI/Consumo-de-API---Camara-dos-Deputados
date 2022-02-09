let urlDep = "https://dadosabertos.camara.leg.br/api/v2/deputados?itens=100";
let urlPart= "https://dadosabertos.camara.leg.br/api/v2/partidos?itens=100";
var listaDeps = new Array();
var listaPart = new Array();
let k=0;
let par = document.querySelector('#tela');
let partido = document.querySelector('#buscarDep_Part');
let nomeDep = document.querySelector('#buscarDep_Nome');
let sigla = document.querySelector('#buscarPart_sigla');
let fotoDep = document.querySelector('#FotoDep');
let nomeFoto = document.querySelector("#nomeDep");
document.querySelector('#buscarDep').onclick = function(){
    gerarListaDeP(0);
}

document.querySelector('#buscarPart').onclick = function(){
    gerarlistaPart(0);
}

document.querySelector('#submit3').onclick = function(){
    gerarlistaPart(1);
}

document.querySelector('#submit').onclick = function(){
    gerarListaDeP(1);
}

document.querySelector('#submit2').onclick = function(){
    gerarListaDeP(2);
}

function gerarListaDeP(key){
    let request = new XMLHttpRequest();
    let corpo;
    let link;
    request.open('GET',urlDep, true);
   
    request.onload = function(e){
        if(request.readyState === request.DONE){
            if(request.status >= 200 && request.status <300){
                let jsonObj = request.response;

                corpo = jsonObj.dados;
                link = jsonObj.links;
                
                listaDeps = listaDeps.concat(corpo);
                for (var i = 0; i < 4; i++) {

                    if (link[i].rel === "next") {
                        urlDep=link[i].href
                        gerarListaDeP(key);
                        return;
                    }
                }
                if(key===0){
                    imprimir(); 
                }else{
                    if(key===1){
                        imprimirDep_Part();
                    }else{
                        imprimirDep_Nome();
                    }   
                }
                
                
            }else{
                alert('Erro ao receber os dados: '+request.statusText);
            }
        }
    }; 
    request.setRequestHeader('Accept', 'application/json');
    
    request.onerror = function(e){
        alert('Erro: '+request.statusText);
    }
    
    request.responseType = 'json';
    request.send(null);
}

function gerarlistaPart(key){
    let request = new XMLHttpRequest();
    let corpo;
    let link;
    request.open('GET',urlPart, true);
   
    request.onload = function(e){
        if(request.readyState === request.DONE){
            if(request.status >= 200 && request.status <300){
                let jsonObj = request.response;

                corpo = jsonObj.dados;
                link = jsonObj.links;
                
                listaPart = listaPart.concat(corpo);
                if(key===0){
                   imprimir1(); 
                }else{
                    imprimirPart();
                }
                
                
            }else{
                alert('Erro ao receber os dados: '+request.statusText);
            }
        }
    }; 
    request.setRequestHeader('Accept', 'application/json');
    
    request.onerror = function(e){
        alert('Erro: '+request.statusText);
    }
    
    request.responseType = 'json';
    request.send(null);
}

function imprimir(){
    let i=0;
    par.innerHTML = par.innerHTML = ' ';
    document.getElementById("depFederal").style.visibility = "hidden";
    nomeFoto.innerHTML = " ";
    fotoDep.setAttribute("src"," ");

    while(listaDeps[i]){
        par.innerHTML += "<a href='javascript:mostrarFoto("+i+")'>"+listaDeps[i].nome +' '+ listaDeps[i].siglaPartido +'</a>' +'<br>';
        i++;
    }
    
}

function imprimir1(){
    let i=0;
    par.innerHTML=' ';
    document.getElementById("depFederal").style.visibility = "hidden";
    nomeFoto.innerHTML = " ";
    fotoDep.setAttribute("src"," ");

    while(listaPart[i]){
        par.innerHTML += "<a href='javascript:mostrarFoto("+i+")'>"+listaPart[i].nome + '</a>' +'<br>' ;
        i++;
    }
    
}

function imprimirDep_Part(){
    let i=0;
    par.innerHTML=' ';
    document.getElementById("depFederal").style.visibility = "hidden";
    nomeFoto.innerHTML = " ";
    fotoDep.setAttribute("src"," ");

    while(i<=512){

        if(listaDeps[i].siglaPartido === partido.value){
           par.innerHTML += "<a href='javascript:mostrarFoto("+i+")'>"+listaDeps[i].nome +' '+ listaDeps[i].siglaPartido +'</a>' +'<br>'; 
        }
        
        i++;
    }
}

function imprimirDep_Nome(){
    let i=0;
    par.innerHTML=' ';
    
    while(i<=512){
        
        if(listaDeps[i].nome === nomeDep.value){
              
            mostrarFoto(i);
        }
        i++;
    }
}

function imprimirPart(){
    let i=0;
    par.innerHTML=' ';
    
    while(i<=listaPart.length){

        if(listaPart[i].sigla === sigla.value){
           par.innerHTML = listaPart[i].nome +' '+ listaPart[i].sigla +'<br>'; 
           i=listaPart.length;
        }
        
        i++;
    }
}

function mostrarFoto(pos){
    document.getElementById("depFederal").style.visibility = "visible";
    nomeFoto.innerHTML = listaDeps[pos].nome+"<br>"+listaDeps[pos].siglaPartido+"-"+listaDeps[pos].siglaUf;
    fotoDep.setAttribute("src",listaDeps[pos].urlFoto);
}