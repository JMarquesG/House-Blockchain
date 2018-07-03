pragma solidity ^0.4.23;


contract InitialCreator{
	Notaria dirNotaria;
	Casa dirCasa;
    uint[] catastres;
	constructor() public {
		dirNotaria = new Notaria(msg.sender);

	}
	function createnewNotaria() public{
	    dirNotaria = new Notaria(msg.sender);
	}

	function consultadirNotaria() public returns (Notaria){
	    return dirNotaria;
	}

	mapping(uint => Casa) public Registre;

	function createnewCasa(address _propietari, string _nomPropietari, uint _catastre) public  returns (uint){
		dirCasa = new Casa(_propietari,_nomPropietari, _catastre, dirNotaria);
		Registre[_catastre] = dirCasa;
		catastres.push(_catastre);
		return _catastre;
	}

	function ConsultaCatastres() public returns (uint[]){
	    return catastres;
	}

	function consultaCasa(uint _catastre) public returns (Casa){
	    return Registre[_catastre];
	}
}

contract Notaria{
	struct Notari {
		string nom;
		bool valid;
	}

	constructor(address genesis) public {
	    Notaris[genesis] = Notari({nom:'Genesis', valid:true});
	}


	mapping(address => Notari) private Notaris;
	function crearNotari(address _notari, string _nom) public {
		require(esNotari(msg.sender));
		Notaris[_notari] = Notari({nom:_nom, valid:true});
	}

	function esNotari(address _notari) public returns (bool){
		return Notaris[_notari].valid;
	}
}

contract Casa{
	address propietari;
	string nomPropietari;
	uint catastre;

	Compra dirCompra;
	bool confirmarCompraPendent;

	Herencia dirHerencia;
	bool existeixHerencia;

	Notaria dirNotaria; //Direcció smartContract Notaria
	constructor (address _propietari, string _nomPropietari, uint _catastre, Notaria _dirNotaria) public payable {
		propietari = _propietari;
		nomPropietari = _nomPropietari;
		catastre = _catastre;
		dirNotaria = _dirNotaria;
		confirmarCompraPendent = false;
		existeixHerencia =false;
	}

    function getCompraPendent() public returns (bool) {
	    return confirmarCompraPendent;
	}

    function getHerenciaPendent() public returns (bool) {
	    return existeixHerencia;
	}

	function getCatastre() public returns (uint) {
	    return catastre;
	}

	function getAddressPropietari() public returns (address){
	    return propietari;
	}

	function getPropietari() public returns (string){
	    return nomPropietari;
	}

	function createCompra(address _comprador, string _nomPropietari) public {
		if(dirNotaria.esNotari(msg.sender)){
			dirCompra = new Compra(msg.sender,_comprador, _nomPropietari);
			confirmarCompraPendent = true;
		}

	}

	function canviarPropietaricompra() public{
		if (confirmarCompraPendent == true){
			if(dirNotaria.esNotari(msg.sender)){
				propietari = dirCompra.Comprador();
				nomPropietari = dirCompra.nomComprador();
				confirmarCompraPendent = false;
			}
		}
	}

	function createHerencia(address _hereu, string _nomHereu) public {
		if(dirNotaria.esNotari(msg.sender)){
			dirHerencia = new Herencia(_hereu, _nomHereu);
			existeixHerencia = true;
		}


	}

	function canviarPropietariherencia() public{
		if (existeixHerencia == true){
			if(dirNotaria.esNotari(msg.sender)){
				propietari = dirHerencia.Hereu();
				nomPropietari = dirHerencia.nomHereu();
				existeixHerencia = false;
			}
		}
	}

}


contract Herencia{
	address hereu;
	string nomhereu;
	constructor (address _hereu, string _nomhereu) public {
		hereu = _hereu;
		nomhereu = _nomhereu;
	}

	function Hereu() public returns (address){
		return hereu;
	}

	function nomHereu() public returns (string){
		return nomhereu;
	}


}


contract Compra{
	address Notari;
	address comprador;
	string nomcomprador;
	constructor (address _notari, address _comprador,string _nomcomprador) public {
		Notari = _notari;
		comprador = _comprador;
		nomcomprador = _nomcomprador;
	}

	function Comprador() public returns (address){
		return comprador;
	}
	function nomComprador() public returns (string){
		return nomcomprador;
	}

}
