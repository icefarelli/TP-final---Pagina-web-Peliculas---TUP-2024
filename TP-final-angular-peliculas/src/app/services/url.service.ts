import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UrlService {
  private ngrokApiUrl = 'http://127.0.0.1:4040/api/tunnels';

  constructor(private http: HttpClient) {}

  loadNgrokUrl(): Observable<string> {
    const headers = new HttpHeaders({
      'Accept': 'application/xml'
    });

    return this.http.get(this.ngrokApiUrl, { headers, responseType: 'text' }).pipe(
      map((response) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(response, 'application/xml');
        const publicUrlElement = xmlDoc.getElementsByTagName('PublicURL')[0];
        if (publicUrlElement) {
          return publicUrlElement.textContent || '';
        }
        throw new Error('No se encontró la URL pública en la respuesta de ngrok.');
      })
    );
  }
}
