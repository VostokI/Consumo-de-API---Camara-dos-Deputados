//Links para as requisições
let urlDep = "https://dadosabertos.camara.leg.br/api/v2/deputados?itens=100";
let urlPart= "https://dadosabertos.camara.leg.br/api/v2/partidos?itens=100";

//criação das listas
var listaDeps = new Array();
var listaPart = new Array();

let k=0;
let par = document.querySelector('#tela');
let partido = document.querySelector('#buscarDep_Part');
let nomeDep = document.querySelector('#buscarDep_Nome');
let sigla = document.querySelector('#buscarPart_sigla');
let fotoDep = document.querySelector('#FotoDep');
let nomeFoto = document.querySelector("#nomeDep");
let gastoTotal = document.querySelector('#gastoTotal');

//ações dos botões
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

//gera a lista com base na chave de acesso
function gerarListaDeP(key){
    gastoTotal.style.visibility = 'hidden';

    let request = new XMLHttpRequest();
    let corpo;
    let link;

    //aciona a função pegar (get) e adiciona o local (urlDep)
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

//gera a lista dos partidos junto com a requisição e as funções com base na key informada
function gerarlistaPart(key){
    gastoTotal.style.visibility = 'hidden';

    let request = new XMLHttpRequest();
    let corpo;
    let link;

    //aciona a função pegar (get) e adiciona o local (urlDep)
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

//imprime os dados dos deputados
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

//imprime os deputados do partido
function imprimir1(){
    let i=0;
    par.innerHTML=' ';
    document.getElementById("depFederal").style.visibility = "hidden";
    nomeFoto.innerHTML = " ";
    fotoDep.setAttribute("src"," ");

    while(listaPart[i]){
        par.innerHTML += "<a href='javascript:listarDepsPelaLista("+i+")'>"+listaPart[i].nome + '</a>' +'<br>' ;
        i++;
    }
    
}

//lista os deputados do partido
function listarDepsPelaLista(i){
    gastoTotal.style.visibility = "hidden";
    partido.value = listaPart[i].sigla;
    gerarListaDeP(1);
}

//imprime o deputados, com foto, nome e sigla do partido
function imprimirDep_Part(){
    let i=0;
    par.innerHTML=' ';
    document.getElementById("depFederal").style.visibility = "hidden";
    nomeFoto.innerHTML = " ";
    fotoDep.setAttribute("src"," ");

    while(i<=512){

        if(listaDeps[i].siglaPartido === partido.value){
           par.innerHTML += "<a href='javascript:mostrarFoto("+i+")'>"+listaDeps[i].nome +' '+ listaDeps[i].siglaPartido +'</a>' +'<br>'; 

            var urlDespesas = "https://dadosabertos.camara.leg.br/api/v2/deputados/"+listaDeps[i].id+"/despesas?ordem=ASC&ordenarPor=ano";
            somarDespesas(urlDespesas);
        }
        
        i++;
    }
}

//imprime uma lista contendo os deputados
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

//imprime a lista dos deputados do partido
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

//pega a foto de deixa visivel junto com o nome, o partido e o estado
function mostrarFoto(pos){
    document.getElementById("depFederal").style.visibility = "visible";
    nomeFoto.innerHTML = listaDeps[pos].nome+"<br>"+listaDeps[pos].siglaPartido+"-"+listaDeps[pos].siglaUf;
    fotoDep.setAttribute("src",listaDeps[pos].urlFoto);
    gastoTotal.style.visibility = 'visible'
    var urlDespesas = "https://dadosabertos.camara.leg.br/api/v2/deputados/"+listaDeps[pos].id+"/despesas?ordem=ASC&ordenarPor=ano";
        somarDespesas(urlDespesas);
}

//função que soma todas as despesas dos deputados
function somarDespesas(urlDespesas){
    let request = new XMLHttpRequest();
    let despesa;
    let despesaTotal = 0;

    //aciona a função pegar (get) e adiciona o local (urlDep)
    request.open('GET',urlDespesas, true);
   
    request.onload = function(e){
        if(request.readyState === request.DONE){
            if(request.status >= 200 && request.status <300){
                let jsonObj = request.response;
                
                for(let k=0; k<jsonObj.dados.length; k++){
                    despesa = parseInt(jsonObj.dados[k].valorLiquido);
                    despesaTotal += despesa;
                }
                gastoTotal.innerHTML = despesaTotal.toLocaleString("pt-BR");
                
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