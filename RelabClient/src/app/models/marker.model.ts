import { Icon } from './icon.model';

export class Marker {
    icon = {}
    constructor(public lat: number, public lng: number, public label?: string)
    {
        if (this.label.includes("Gas")) {
            this.icon = new Icon ('./assets/immagini/bull-2-16.ico', 24 );
            this.label = "";
            return;
        }
        if(this.label.includes("elettrica"))
        {
          this.icon = new Icon ('./assets/immagini/toxic-16.ico', 24 );
          this.label = "";
          return;
        }
    }
}
