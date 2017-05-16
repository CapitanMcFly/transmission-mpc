import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Events } from 'ionic-angular';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import { ConnectionInfo } from './connection-info';


@Injectable()
export class CommService {

  req_url: string;
  req_options: RequestOptions;

  constructor(public http: Http, public connectionInfo: ConnectionInfo, public events: Events) { }

  // This method is used to test rpc funtionalities
  post(method: string){
    let body = '{"method": "'+ method + '"}';

    this.http.post(this.req_url, body, this.req_options)
    .map(res => res.json())
    .subscribe(
      data => {
        console.log(data);
      },
      err => {
        console.log("post ERROR:");
        console.log(err);
      }
    );
  }

  // This method gets session id (required for all requests)
  firstSessionGet(){
    this.req_url = 'http://'+ this.connectionInfo.host_dir + ':' + this.connectionInfo.listen_port + this.connectionInfo.api_path;
    let body = '{"method": "session-get"}';
    let req_headers = new Headers({
      'Content-Type': 'json',
      'Authorization': 'Basic ' + this.connectionInfo.userpass_b64,
      'X-Requested-With': 'XMLHttpRequest'
    });
    this.req_options = new RequestOptions({headers: req_headers});

    this.http.post(this.req_url, body, this.req_options)
    .map(res => res.json())
    .subscribe(
      data => {
        // This POST always gets a 409 error because the 'X-Transmission-Session-Id' header is missing
        // So, never enter here...
      },
      err => {
        if(err.status === 409){
          // Save session id in request headers
          req_headers.append('X-Transmission-Session-Id', err.headers.get('X-Transmission-Session-Id'));
          this.req_options = new RequestOptions({headers: req_headers});
        } else {
          console.log("firstSessionGet ERROR:");
          console.log(err);
        }
        // Publish the sessionId_ready event, sending the error code
        this.events.publish('user:sessionId_ready', err.status);
      }
    );
  }

  // This method keeps the session open
  nextSessionGet(){
    let body = '{"method": "session-get"}';
    this.http.post(this.req_url, body, this.req_options)
    .map(res => res.json())
    .subscribe(
      data => {
        this.connectionInfo.tparams = data.arguments;
      },
      err => {
        console.log("nextSessionGet ERROR:");
        console.log(err);
      }
    );
  }

  // This method gets stats data
  sessionStats(){
    let body = '{"method": "session-stats"}';
    this.http.post(this.req_url, body, this.req_options)
    .map(res => res.json())
    .subscribe(
      data => {
        this.connectionInfo.tstats = data.arguments;
      },
      err => {
        console.log("sessionStats ERROR:");
        console.log(err);
      }
    );
  }

  // This method gets torrent list
  firstTorrentGet(){
    let body = JSON.stringify({
      "method": "torrent-get",
      "arguments": {
        "fields": ["id", "addedDate", "name", "totalSize", "error", "errorString", "eta", "isFinished", "isStalled", "leftUntilDone", "metadataPercentComplete", "peersConnected", "peersGettingFromUs", "peersSendingToUs", "percentDone", "queuePosition", "rateDownload", "rateUpload", "recheckProgress", "seedRatioMode", "seedRatioLimit", "sizeWhenDone", "status", "trackers", "downloadDir", "uploadedEver", "uploadRatio", "webseedsSendingToUs"]
      }
    });
    this.http.post(this.req_url, body, this.req_options)
    .map(res => res.json())
    .subscribe(
      data => {
        this.connectionInfo.tlist = data.arguments['torrents'];
        // console.log(this.connectionInfo);
      },
      err => {
        console.log("firstTorrentGet ERROR:");
        console.log(err);
      }
    );
  }

  // This method looks at whether the list of torrents has changed
  nextTorrentGet(){
    let body = JSON.stringify({
      "method": "torrent-get",
      "arguments": {
        "fields": ["id", "error", "errorString", "eta", "isFinished", "isStalled", "leftUntilDone", "metadataPercentComplete", "peersConnected", "peersGettingFromUs", "peersSendingToUs", "percentDone", "queuePosition", "rateDownload", "rateUpload", "recheckProgress", "seedRatioMode", "seedRatioLimit", "sizeWhenDone", "status", "trackers", "downloadDir", "uploadedEver", "uploadRatio", "webseedsSendingToUs"],
        "ids": "recently-active"
      }
    });

    return this.http.post(this.req_url, body, this.req_options)
    .map(res => res.json())
    .subscribe(
      data => {
        // this.connectionInfo.tlist = data.arguments['torrents'];
      },
      err => {
        console.log("nextTorrentGet ERROR:");
        console.log(err);
      }
    );
  }

}
