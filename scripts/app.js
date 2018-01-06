
	var productsURL = "http://services.odata.org/V3/Northwind/Northwind.svc/Products?$format=json";
	
	var categoriesURL = "http://services.odata.org/V3/Northwind/Northwind.svc/Categories?$format=json";
	
	var allCategories = [];
	var products = [];
	getCategories();
	getProducts();
	
//jquery date picker
	$( function() {
		$( "#input_uploadtime" ).datepicker({
			changeMonth: true,
			changeYear: true,
			dateFormat: "dd/mm/yy"
		});
	} );

//funkcija koja vraca korisnika na stranu za logovanje	
	function redirect(){
		var x = window.location.href.replace("main","index");
		window.location.replace(x);
	}
	
//provera da li je korisnik ulogovan
	function checkStorage(){
		var x = sessionStorage.getItem("loginSuccessful");
		if(!x){
			redirect();
		}
	}	
	
//random path za sliku
	function randomImagePath(){
		min = 1;
		max = 6;
		
		var z = Math.round(Math.random() * (max - min)) + min;
		var imagePath = "images/" + z + ".png";
		return imagePath;
	}
//skuplja kategorije sa sajta	
	function getCategories(){
		allCategories = getServiceData(categoriesURL).value;
		categoryChoice();
	}
//iscrtava ponudjene kategorije u formi za unos proizvoda
	function createCategoryOption(categoryId,categoryName){
		var selectLang = document.getElementById("input_category");
		
		var optionLang = document.createElement("option");
		optionLang.setAttribute("value",categoryId);
		optionLang.innerHTML = categoryName;
		selectLang.appendChild(optionLang);	
	
		var searchCategory = document.getElementById("categorySearch");
		
		var optionCategory = document.createElement("option");
		optionCategory.setAttribute("value",categoryId);
		optionCategory.innerHTML = categoryName;
		searchCategory.appendChild(optionCategory);	
	}

//funkcija koja stvara ponudjene kategorije na osnovu onih sa sajta	
	function categoryChoice(){
		for(var i in allCategories){
			createCategoryOption(allCategories[i].CategoryID,allCategories[i].CategoryName);
		}
	}
//skuplja informacije o proizvodima i salje ih na iscrtavanje	
	function getProducts(){
		products = getServiceData(productsURL).value;
		showProducts(products);
	}
//ispisuje naziv kategorije na osnovu id-a proizvoda	
	function getCategoryNameByCategoryID(categoryId,allCategories){
		for(var i in allCategories){
			if(allCategories[i].CategoryID == categoryId){
				return allCategories[i].CategoryName;
			}
		}
		return "Unknown category";
	}
//iscrtava proizvode tako sto provlaci kroz petlju funkciju koja iscrtava samo jedan proizvod
	function showProducts(products){
		for(var i in products){
			products[i].ImagePath = randomImagePath();
			var a = new Date();
			products[i].CreationDate = a.getDate() + "/" + a.getMonth()+1 + "/" + a.getFullYear();
			products[i].CategoryName = getCategoryNameByCategoryID(products[i].CategoryID,allCategories);
			products[i].ProductQty = 0;
			showProduct(products[i],"products-holder");
		 }
	}
//http request	
	function getServiceData(url,username, password) {

    try {
	var result;
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200) {
                    result = JSON.parse(xmlhttp.response);
                }
                else {
                    return false;
                }
            }
        }
        xmlhttp.open("GET", url, false, username, password);
        xmlhttp.send();
		return result;
    }
    catch (err) {       
        return err;
    }
	}
	
	var addedProducts = [];
//funkcija koja proverava da li su podaci koji su uneti ispravni (ako jesu stvara novi proizvod za iscrtavanje)	
	var count = products.length;
	
	function formValidation(){
		count += 1;
		var priceVal = document.getElementById("prodPrice");
		var nameVal = document.getElementById("input_prodname");
		var unitPrice = document.getElementById("prodPrice").value;
		var imagePath = "images/" + document.getElementById("imgPath").value.substring(12);
		var productName = document.getElementById("input_prodname").value;
		var creationDate = document.getElementById("input_uploadtime").value;
		var categoryId = document.getElementById("input_category").value;
		var categoryName = getCategoryNameByCategoryID(categoryId,allCategories);
		var productId = count;
		var productQty = 0; 
		
		if(priceVal.checkValidity() && nameVal.checkValidity()){
			var proizvod = new Proizvod(productId,productName,categoryId,categoryName,unitPrice,imagePath,creationDate,productQty);
			showProduct(proizvod,"products-holder");
			addedProducts.push(proizvod);
		}
		else{
			alert("Podaci koje ste uneli u formu nisu ispravni");
		}
	} 
//konstruktorska funkcija	
	function Proizvod(productId,productName,categoryId,categoryName,unitPrice,imagePath,creationDate,productQty){
		this.ImagePath = imagePath;
		this.UnitPrice = unitPrice;
		this.ProductName = productName;
		this.ProductID = productId;
		this.CategoryName = categoryName;
		this.CategoryID = categoryId;
		this.CreationDate = creationDate;
		this.ProductQty = productQty;
	}
/*
//dodatan property za button ako je u korpi po kome ce da bude prepoznat input za kolicnu
	function buttonProperty(cartOrMain,proizvod){
		if(cartOrMain == "cart-holder"){
			var qInput = document.createElement("input");
			qInput.setAttribute("value","1");
			qInput.setAttribute("type","number");
			qInput.setAttribute("id","qtyCart" + proizvod.ProductID);
			newDiv.appendChild(qInput);
			
			var btnAdd = document.createElement("button");
			btnAdd.setAttribute("id", proizvod.ProductID);
			btnAdd.setAttribute("name","cartAdd");
			btnAdd.setAttribute("onclick","dodaj(this)");
			btnAdd.innerHTML = "Dodaj u korpu"
			newDiv.appendChild(btnAdd);
		
			var btnSub = document.createElement("button");
			btnSub.setAttribute("id", proizvod.ProductID);
			btnSub.setAttribute("name","cartSub");
			btnSub.setAttribute("onclick","oduzmi(this)");
			btnSub.innerHTML = "Izbaci iz korpe"
			newDiv.appendChild(btnSub);
			
			var productQuantity = document.createElement("p");
			productQuantity.setAttribute("id", "product_quantity");
			productQuantity.innerHTML = proizvod.ProductQty
			newDiv.appendChild(productQuantity);
		}
		else if(cartOrMain == "products-holder"){
			var qInput = document.createElement("input");
			qInput.setAttribute("value","1");
			qInput.setAttribute("type","number");
			qInput.setAttribute("id","qtyCart" + proizvod.ProductID);
			newDiv.appendChild(qInput);
			
			var btnAdd = document.createElement("button");
			btnAdd.setAttribute("id", proizvod.ProductID);
			btnAdd.setAttribute("onclick","dodaj(this)");
			btnAdd.innerHTML = "Dodaj u korpu"
			newDiv.appendChild(btnAdd);
		
			var btnSub = document.createElement("button");
			btnSub.setAttribute("id", proizvod.ProductID);
			btnSub.setAttribute("onclick","oduzmi(this)");
			btnSub.innerHTML = "Izbaci iz korpe"
			newDiv.appendChild(btnSub);
		}
	}
*/	

//funkcija za dodavanje novih proizvoda
	function showProduct(proizvod,targetPlace){
		
		var productsHolder = document.getElementById(targetPlace);
		
		var newDiv = document.createElement("div");
		newDiv.setAttribute("class","product-box");
		productsHolder.insertBefore(newDiv, productsHolder.firstChild);

		var prodTop = document.createElement("div");
		prodTop.setAttribute("class","product_top");
		newDiv.appendChild(prodTop);
		
		var prodCategory = document.createElement("p");
		prodCategory.setAttribute("class","product_category");
		prodCategory.innerHTML = proizvod.CategoryName;
		newDiv.appendChild(prodCategory);
		
		var uploadTime = document.createElement("p");
		uploadTime.setAttribute("class","upload_time");
		uploadTime.innerHTML = proizvod.CreationDate;
		newDiv.appendChild(uploadTime);
		
		var imgHolder = document.createElement("div");
		imgHolder.setAttribute("class","image-holder");
		newDiv.appendChild(imgHolder);
		
		var prodImg = document.createElement("img");
		prodImg.setAttribute("src",proizvod.ImagePath);
		imgHolder.appendChild(prodImg);
		
		var prodName = document.createElement("p");
		prodName.setAttribute("class","product_name");
		prodName.innerHTML = proizvod.ProductName;
		newDiv.appendChild(prodName);
		
		var prodPrice = document.createElement("p");
		prodPrice.setAttribute("class","product_price");
		prodPrice.setAttribute("id","cena" + proizvod.ProductID);
		prodPrice.innerHTML = proizvod.UnitPrice;
		newDiv.appendChild(prodPrice);
		
		/*
		var qInput = document.createElement("input");
		qInput.setAttribute("value","1");
		qInput.setAttribute("type","number");
		qInput.setAttribute("id","qty" + proizvod.ProductID);
		newDiv.appendChild(qInput);
		*/
		
		if(targetPlace == "cart-holder"){
			var qInput = document.createElement("input");
			qInput.setAttribute("value","1");
			qInput.setAttribute("type","number");
			qInput.setAttribute("id","qtyCart" + proizvod.ProductID);
			newDiv.appendChild(qInput);
			
			var btnAdd = document.createElement("button");
			btnAdd.setAttribute("id", proizvod.ProductID);
			btnAdd.setAttribute("name","cartBtn");
			btnAdd.setAttribute("class","cart-plus");
			btnAdd.setAttribute("onclick","dodaj(this)");
			btnAdd.innerHTML = "+"
			newDiv.appendChild(btnAdd);
		
			var btnSub = document.createElement("button");
			btnSub.setAttribute("id", proizvod.ProductID);
			btnSub.setAttribute("name","cartBtn");
			btnSub.setAttribute("class","cart-minus");
			btnSub.setAttribute("onclick","oduzmi(this)");
			btnSub.innerHTML = "-"
			newDiv.appendChild(btnSub);
			
			var productQuantity = document.createElement("p");
			productQuantity.setAttribute("id", "product_quantity");
			productQuantity.innerHTML = proizvod.ProductQty
			newDiv.appendChild(productQuantity);
		}
		else if(targetPlace == "products-holder"){
			var qInput = document.createElement("input");
			qInput.setAttribute("value","1");
			qInput.setAttribute("type","number");
			qInput.setAttribute("id","qty" + proizvod.ProductID);
			newDiv.appendChild(qInput);
			
			var btnAdd = document.createElement("button");
			btnAdd.setAttribute("id", proizvod.ProductID);
			btnAdd.setAttribute("onclick","dodaj(this)");
			btnAdd.innerHTML = "Dodaj u korpu"
			newDiv.appendChild(btnAdd);
		
			var btnSub = document.createElement("button");
			btnSub.setAttribute("id", proizvod.ProductID);
			btnSub.setAttribute("onclick","oduzmi(this)");
			btnSub.innerHTML = "Izbaci iz korpe"
			newDiv.appendChild(btnSub);
		}
		/*
		var btnAdd = document.createElement("button");
		btnAdd.setAttribute("id", proizvod.ProductID);
		btnAdd.setAttribute("onclick","dodaj(this)");
		btnAdd.innerHTML = "Dodaj u korpu"
		newDiv.appendChild(btnAdd);
		
		var btnSub = document.createElement("button");
		btnSub.setAttribute("id", proizvod.ProductID);
		btnSub.setAttribute("onclick","oduzmi(this)");
		btnSub.innerHTML = "Izbaci iz korpe"
		newDiv.appendChild(btnSub);
		*/
		
		/*
		//docrtava paragraf sa brojem proizvoda samo ako idu u korpu
		if(targetPlace == "cart-holder"){
			var productQuantity = document.createElement("p");
			productQuantity.setAttribute("id", "product_quantity");
			productQuantity.innerHTML = proizvod.ProductQty
			newDiv.appendChild(productQuantity);
		}
		*/
	}

	
	var s = 0;
	var korpa = [];
/*		
//funkcija za dodavanje proizvoda u korpu (samo id)
	function dodaj(x){
		idd = x.id;
		idc = "cena" + idd;
		var cena = new Number(document.getElementById(idc).innerHTML);
		idk = "qty" + idd;
		var kolicina = document.getElementById(idk).valueAsNumber;

		s += cena * kolicina;
		document.getElementById("suma").innerHTML = "Ukupno: " + s + " din.";	
		
			//dodavanje proizvoda u korpu		
			while(kolicina > 0){
			korpa.push(idd);
			kolicina--;
			}
		}
*/			
/*	
//funkcija koja proverava da li se proizvod nalazi u korpi (bolja funkcija ispod)
	function isProductInCart(productId,korpa){
		var isInCart = false;
		for(var i in korpa){
			if(productId == korpa[i].ProductID){
				isInCart = true;
			}
		}
		if(isInCart){
			return true;
		}	
		else{
			return false;
		}
	}
*/
//prepravljena funkcija koja proverava da li se proizvod nlazi u nekom nizu po potrebi
	function isElementInArray(productId,niz){
		var exists = false;
		for(var i in niz){
			if(productId == niz[i].ProductID){
				exists = true;
			}
		}
		if(exists){
			return true;
		}	
		else{
			return false;
		}
	}

//funkcija za zaokruzivanje (za sumu da bi se izbeglo previse decimala)
	function round(value){
		return Number(Math.round(value + 'e2') + 'e-2');
	}
	
//funkcija za dodavanje proizvoda u korpu (ceo proizvod)	
	function dodaj(x){
		var q = realQuantity(x);
		var cena = new Number(document.getElementById("cena" + x.id).innerHTML);
		s+= cena * q;
		
		//zaokruzuje s na 2 decimale
		s = round(s);
		
		document.getElementById("suma").innerHTML = "Ukupno: " + s + " din.";
		
		if(isElementInArray(x.id,korpa)){
			for(var i in korpa){
				if(x.id == korpa[i].ProductID){
					korpa[i].ProductQty += q;
				}
			}		
			showCart(korpa);		
		}
		else{
			if(isElementInArray(x.id,products)){
				korpa.push(getProductByProductId(x.id,products));
				for(var i in korpa){
					if(x.id == korpa[i].ProductID){
						korpa[i].ProductQty += q;
					}
				}
				showCart(korpa);
			}
			else{
				korpa.push(getProductByProductId(x.id,addedProducts));
				for(var i in korpa){
					if(x.id == korpa[i].ProductID){
						korpa[i].ProductQty += q;
					}
				}
				showCart(korpa);
			}
		}
	}
		
//funkcija koja pronalazi proizvode po id-u 	
	function getProductByProductId(productId,products){
		for(var i in products){
			if(products[i].ProductID == productId){
				return products[i];
			}
		}		
	}
/*	
//brojac proizvoda u korpi		
	function brojac(){
		var counter = 0;
		for(var i in korpa){
			if(korpa[i] == idd){
			counter++;
			}
		}
	return counter;	
	}
*/

//funkcija koja brise proizvode iz korpe da bi se opet iscrtavali
	function clearCart(){
		document.getElementById("cart-holder").innerHTML= "";
	}
	
//funkcija za iscrtavanje proizvoda u korpi
	function showCart(korpa){
		clearCart();
		for(var i in korpa){
			showProduct(korpa[i],"cart-holder");
		}
	}

//funkcija koja odredjuje pravi q input	
	function realQuantity(buttonName){
		if(buttonName.name == "cartBtn"){
			var q = document.getElementById("qtyCart" + buttonName.id).valueAsNumber;
		}
		else{
			var q = document.getElementById("qty" + buttonName.id).valueAsNumber;
		}
		return q;
	}
	
//funkcija za oduzimanje od sume
	function oduzmi(x){
		var q = realQuantity(x);
		var cena = new Number(document.getElementById("cena" + x.id).innerHTML);
		
		if(isElementInArray(x.id,korpa)){
			for(var i in korpa){
				if(x.id == korpa[i].ProductID){
					if(q < korpa[i].ProductQty){
						korpa[i].ProductQty = korpa[i].ProductQty - q;
						s -= cena * q;
						s = round(s);
						document.getElementById("suma").innerHTML = "Ukupno: " + s + " din.";
						showCart(korpa);		
					}
					else if(q > korpa[i].ProductQty){
						alert("Broj proizvoda koje zelite da izbacite iz korpe je veci od broja proizvoda u Vasoj korpi.");
					}
					else if(q == korpa[i].ProductQty){
						korpa[i].ProductQty = 0;
						s -= cena * q;
						s = round(s);
						document.getElementById("suma").innerHTML = "Ukupno: " + s + " din.";
						korpa.splice(i,1);
						showCart(korpa);
					}
				}	
			}
		}
		else{
			alert("Proizvod koji ste odabrali se ne nalazi u korpi");
		}		
	}
	
/*	
//funkcija za oduzimanje od sume
	function oduzmi(x){
		idd = x.id;
		idc	= "cena" + idd;
		var cena = new Number(document.getElementById(idc).innerHTML);
		idk	= "qty" + idd;
		var kolicina = document.getElementById(idk).value;

//izbacivanje proizvoda iz niza korpa 
			if(brojac() >= kolicina){
				s -= cena*kolicina;
				document.getElementById("suma").innerHTML = "Ukupno: " + s + " din.";	
					while(kolicina > 0){
						korpa.splice(korpa.indexOf(idd),1);
						kolicina--;
					}
				}
			else{
				alert("Broj proizvoda koje zelite da izbacite je veci od broja proizvoda u Vasoj korpi.");
			}	
		}
*/
		
//funkcija za filtriranje
	function search(){

		var searchCategoryId = document.getElementById("categorySearch").value.toLowerCase();
		var searchValue = document.getElementById("searchField").value.toLowerCase();

		if(searchCategoryId != "all"){
			clearAllProducts();
			products1 = getProductsByCategoryId(searchCategoryId, products);
			if(searchValue != ""){
				products2 = getProductsBySearchValue(searchValue, products1)
				showProducts(products2)
			}
			else{
				showProducts(products1)
			}
		}
		else{
			clearAllProducts();
			if(searchValue != ""){
				products1 = getProductsBySearchValue(searchValue, products)
				showProducts(products1)
			}
			else{
				showProducts(products)
			}
		}

	}
//funkcija koja prima parametre iz inputa i uporedjuje sa proizvodima
	function getProductsBySearchValue(searchParam, products){
		var result = [];
		for(var i in products){
			if(products[i].ProductName.toLowerCase().includes(searchParam) || products[i].CategoryName.toLowerCase().includes(searchParam)){
				result.push(products[i]);
			}
		}
		return result;
	}
//funkcija koja prima parametar iz inputa i trazi takav proizvod
	function getProductsByCategoryId(categoryId, products){
		var result = [];
		for(var i in products){
			if(categoryId == products[i].CategoryID){
				result.push(products[i]);
			}
		}
		return result;
	}

//sklanja sve proizvode sa strane
	function clearAllProducts(){
		document.getElementById("products-holder").innerHTML= "";
	}	

//cisti kompletno korpu
	function fullCartClear(){
		clearCart();
		s = 0;
		document.getElementById("suma").innerHTML = "Ukupno: " + s + " din.";
		korpa.splice(0,korpa.length);
	}
