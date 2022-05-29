import { Injectable, NgZone } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SEOService {

  constructor(private titleService: Title, private meta: Meta,private router : Router ,
    private activatedRoute: ActivatedRoute,) { }

  updateMeta( successCallBack : any ){
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .pipe(map(() => this.activatedRoute))
      .pipe(
        map(route => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        })
      )
      .pipe(filter(route => route.outlet === 'primary'))
      .pipe(mergeMap(route => route.data))
      .subscribe(event => {
        this.updateTitle(event['title']);
        if(event['titleMeta'] == undefined){
          this.updateTitleMeta(event['title']);
        }else{
          this.updateTitleMeta(event['titleMeta']);
        }
        this.updateDescription(event['title'] + " " + event['description']);
        this.updateKeywords(event['keywords']);
        this.updateOgUrl(event['ogUrl']);
        this.updateOgTitle(event['ogTitle']);
        this.updateOgDescription(event['ogDescription']);
        this.updateOgImage(event['ogImage']);
        successCallBack();
      });
  }

  updateTitle(title: string) {
    this.titleService.setTitle(title);
    //this.meta.updateTag({ name: 'Title', content: title })
  }

  updateTitleMeta(title: string) {
    this.meta.updateTag({ name: 'Title', content: title })
  }

  updateDescription(desc: string) {
    this.meta.updateTag({ name: 'description', content: desc })
  }

  updateKeywords(keywords: string) {
    this.meta.updateTag({ name: 'keywords', content: keywords })
  }

  updateOgUrl(url: string) {
    this.meta.updateTag({ name: 'og:url', content: url })
  }

  updateOgTitle(ogTitle: string) {
    this.meta.updateTag({ name: 'og:title', content: ogTitle })
  }

  updateOgDescription(ogDescription: string) {
    this.meta.updateTag({ name: 'og:description', content: ogDescription })
  }

  updateOgImage(ogImage: string) {
    this.meta.updateTag({ name: 'og:image', content: ogImage })
  }
}
