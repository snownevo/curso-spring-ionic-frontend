import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Spinner } from 'ionic-angular';
import { ProdutoDTO } from '../../models/produto.dto';
import { ProdutoService } from '../../services/domain/produto.service';
import { API_CONFIG } from '../../config/api.config';
import { DomSharedStylesHost } from '@angular/platform-browser/src/dom/shared_styles_host';
//import { API_CONFIG } from '../../config/api.config';

@IonicPage()
@Component({
  selector: 'page-produtos',
  templateUrl: 'produtos.html',
})
export class ProdutosPage {

  items : ProdutoDTO[];

  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     public produtoService: ProdutoService,
     public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    this.loadDate();
  }

  loadDate(){
    let categoria_id = this.navParams.get('categoria_id');
    let loader = this.presentLoading();
    this.produtoService.findByCategoria(categoria_id)
      .subscribe(response => {
        this.items = response['content'];
        loader.dismiss();
        this.loadImagesUrls();
      },
      error => {
        loader.dismiss();
      });
  }

  loadImagesUrls(){
    for(var i=0; i<this.items.length; i++){
      let item=this.items[i];
      this.produtoService.getSmallImageFromBucket(item.id)
        .subscribe(response => {
          item.imageUrl = `${API_CONFIG.bucketBaseUrl}/prod${item.id}-small.jpg`;
        },
        error =>{});
    }
  }

showDetail(produto_id : string){
  this.navCtrl.push('ProdutoDetailPage', {produto_id: produto_id});
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
  this.loadDate();
  setTimeout(() => {
    refresher.complete();
  }, 1000);
}

}