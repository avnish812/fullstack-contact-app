import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';
interface Breadcrumb {
  label: string,
  url: string
}
@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss'
})
export class BreadcrumbComponent {
  breadcrumbs: any[] = [];
  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    console.log(this.router.events)
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      this.breadcrumbs = this.buildBreadcrumbs(this.route.root)
    })
  }

  private buildBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: any[] = []): any {
    const children: ActivatedRoute[] = route.children;
    for (const child of children) {
      const routeUrl = child.snapshot.url.map(segment => segment.path).join('/');
      if (routeUrl !== '') {
        url += `/${routeUrl}`
      }

      const label = child.snapshot.data['breadcrumb'];
      if (label) {
        breadcrumbs.push({ url, label })
      }
      return this.buildBreadcrumbs(child, url, breadcrumbs)
    }
    return breadcrumbs
  }
}
