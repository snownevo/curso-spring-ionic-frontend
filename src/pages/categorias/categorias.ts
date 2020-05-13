import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { CategoriaService } from '../../services/domain/categoria.service';
import { CategoriaDTO } from '../../models/categoria.dto';
import { API_CONFIG } from '../../config/api.config';

/**
 * Generated class for the CategoriasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-categorias',
  templateUrl: 'categorias.html',
})
export class CategoriasPage {

bucketUrl: string = API_CONFIG.bucketBaseUrl;  

page: number = 0;
items: CategoriaDTO[]=[];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public categoriaService: CategoriaService,
    public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
   this.loadDate();
    
  }

  loadDate(){
    let loader = this.presentLoading();
    this.categoriaService.findPage(this.page, 5)
      .subscribe(response => {
        let stasrt = this.items.length;
        this.items = this.items.concat(response['content']);
        let end = this.items.length - 1;
        loader.dismiss();
        console.log(this.page);
        console.log(this.items);
    },
    error => {loader.dismiss();});
  }


  showProdutos(categoria_id: string){
    this.navCtrl.push('ProdutosPage', {categoria_id: categoria_id});
  }

  presentLoading() {
    let loader = this.loadingCtrl.create({
      content: "Aguarde...",
      spinner: "dots"
    });
    loader.present();
    return loader;
  }

  doRefresh(refresher) {
    this.page=0;
    this.items=[];
    this.loadDate();
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }

  doInfinite(infiniteScroll) {
    this.page++;
    this.loadDate();
    setTimeout(() => {
      infiniteScroll.complete();
    }, 1000);
  }
  
}



