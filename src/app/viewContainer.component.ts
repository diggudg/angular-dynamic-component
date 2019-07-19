import { Compiler, Component, Injector, NgModule, NgModuleRef, ViewChild, ViewContainerRef, OnChanges, ComponentRef, TemplateRef, ViewChildren, QueryList } from "@angular/core";
import { CommonModule } from "@angular/common";
import {HelloComponent} from './hello.component'

export class Tempabc {

}
@Component({
    
    selector: 'otf-a-component',
    template: `I am A component that inserts dynamic B component below: <ng-template #msg>a--</ng-template>
    <div #vc></div>  <button type="button" (click)="changeMe()"> Change me</button> `
})

export class ViewContainer {
    // implements OnChanges {<button type="button" (click)="changeMe()"> Change me</button>
    @ViewChild('vc', { read: ViewContainerRef }) _container: ViewContainerRef;

    

    tmpModule: any;
    a: number = 1;
    constructor(private _compiler: Compiler,
        private _injector: Injector,
        private _m: NgModuleRef<any>) {

    }

    ngAfterViewInit() {
        console.log('ngAfterViewInit')
        let template = `<span >First View</span>`;
        console.log(template);
        this.viewChangeMethod(template);
        

    }
    changeMe() {
        this.a = this.a + 1

        this.viewChangeMethod(` New View change ${this.a} time`);

    }
    viewChangeMethod(view: string) {
        let template = `<span>${view} </span><app-hello></app-hello>`;
        const DynamicComponentA = Component({ template: template })(class { });
        @Component({
          selector:'app-hello',
      template: `<h2>This is a dynamic component ${view} </h2>
     `
    })
    class DynamicComponentB {
     
    }
        this._compiler.clearCacheFor(this.tmpModule)
        this.tmpModule = NgModule({ declarations: [DynamicComponentA,DynamicComponentB],imports:[CommonModule] })(class {
        });

        this._compiler.compileModuleAndAllComponentsAsync(this.tmpModule)
            .then((factories) => {
                const f = factories.componentFactories[0];
                const cmpRef = f.create(this._injector, [], null, this._m);
                this._container.detach()
                console.log(cmpRef.hostView)
                this._container.insert(cmpRef.hostView);
            })
        this._compiler.clearCacheFor(this.tmpModule)
    }

}

