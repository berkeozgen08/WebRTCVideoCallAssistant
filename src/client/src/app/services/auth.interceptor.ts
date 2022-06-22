import { Injectable } from '@angular/core';
import {
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

	constructor() { }

	intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
		try {
			const { token } = JSON.parse(localStorage.getItem(environment.ACCESS_TOKEN));
			const newReq = req.clone({
				headers: req.headers.set(
					'Authorization', 'Bearer ' + token
				)
			});
			return next.handle(newReq);
		} catch (e) {
			return next.handle(req);
		}
	}
}
