import React from 'react';
import { connect } from 'react-redux';
import { createEvent } from '../../actions/eventActions';
import TextFieldGroup from '../common/TextFieldGroup';
import jwt from 'jsonwebtoken';
//require('./AgoraRTCSDK-1.8.0.js');

class EventForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      errors: {},
      isLoading: false
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();
    this.props.createEvent(this.state).then(
        (res) => console.log(jwt.decode(localStorage.getItem('channel')).channel),this.join(jwt.decode(localStorage.getItem('channel')).channel),
        (err) => console.log("ca marche pas")
      );
  }

  join(channel){
    var appID="0b276e403f444594bb343274dd953a63";
      
          var client = AgoraRTC.createRtcClient();
          //var client = AgoraRTC.createLiveClient()
          client.init(appID, function() {
              console.log("client init");
              client.join(channel, 0, function(uid){
          //success
          console.log("client " + uid + " joined channel");
          console.log("let's launch the stream");
          var localStream = AgoraRTC.createStream({streamID: uid, audio:true, video:true, screen:false});
          //localStream.setVideoProfile('720p_3');
          localStream.init(function() {
                  console.log("getUserMedia successfully");

                  localStream.play('agora_local');

                  client.publish(localStream, function (err) {
                    console.log("Publish local stream error: " + err);
                  });

                  client.on('stream-published', function (evt) {
                    console.log("Publish local stream successfully");
                  });
                }, function (err) {
                  console.log("getUserMedia failed", err);
                });

          }
          , errorCallback);
          }, function(err) {
            log("client init failed ", err);
            //error handling
          });
          
           client.on('stream-added', function (evt) {
            var stream = evt.stream;
            console.log("New stream added: " + stream.getId());
            console.log("Subscribe ", stream);
            client.subscribe(stream, function (err) {
              console.log("Subscribe stream failed", err);
            });
          });

          client.on('stream-subscribed', function (evt) {
            var stream = evt.stream;
            console.log("Subscribe remote stream successfully: " + stream.getId());
            if ($('div#video #agora_remote'+stream.getId()).length === 0) {
              $('div#video').append('<div id="agora_remote'+stream.getId()+'" style="float:left; width:810px;height:607px;display:inline-block;"></div>');
            }
            stream.play('agora_remote' + stream.getId());
          });

          client.on('stream-removed', function (evt) {
            var stream = evt.stream;
            stream.stop();
            $('#agora_remote' + stream.getId()).remove();
            console.log("Remote stream is removed " + stream.getId());
          });

          client.on('peer-leave', function (evt) {
            var stream = evt.stream;
            stream.stop();
            $('#agora_remote' + stream.getId()).remove();
            console.log(evt.uid + " leaved from this channel");
          });
        

        var errorCallback=function(){
          //fail
          console.log("�a marche pas");
        }
  }

  render() {
    const { title, errors, isLoading } = this.state;

    return (
      <div className="row">
            <div className="col-md-6">
              <div className="panel panel-default" id="headings">
                    <div className="panel-heading">Caller Information</div>
                    <div className="panel-body">
                      <form>
                        <fieldset>
                        <legend>Outdoor Location Information</legend>
                        <div className="form-group">
                          <label htmlFor="civicAddress">Civic Address</label>
                          <input type="text" className="form-control" id="civicAddress" placeholder="Street Address, City, State, ZipCode "/>
                        </div>
                      </fieldset>
                      <fieldset>
                        <legend>Indoor Location Information</legend>
                          <div className="form-group row">
                          <div className="col-md-8">
                          <label htmlFor="room">Room</label>
                          <input type="text" className="form-control" id="room" placeholder="Room"/>
                          </div>
                          <div className="col-md-4">
                          <label htmlFor="room">Floor</label>
                          <input type="text" className="form-control" id="floor" placeholder="Floor"/>
                          </div>
                        </div>
                      </fieldset>
                      <fieldset>
                        <legend>Private Information</legend>
                      </fieldset>
                    </form> 
                    </div>
                </div>
            </div>
            <div className="col-md-6">
              <div className="panel panel-default" id="headings">
                    <div className="panel-heading"><div>Video<a href="#" onClick={this.onSubmit.bind(this)} style={{float:'right'}}>Connect to your Channel</a></div></div>
                    <div className="panel-body">
                      <div id="agora_remote" style={{width: 'auto', height: '400px', position:'relative'}}>
                        <div id="agora_local" style={{width: '150px', height: '100px', position:'absolute', bottom:'0', right:'0', margin:'5px'}}>
                        </div>
                      </div>
                    </div>
                </div>
            </div>
          </div>
    );
  }
}

EventForm.propTypes = {
  createEvent: React.PropTypes.func.isRequired
}

export default connect(null, { createEvent })(EventForm);
