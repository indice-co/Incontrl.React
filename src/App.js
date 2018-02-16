import React, {Component} from 'react';
import './App.css';
import DocumentList from './DocumentList';
import TransactionList from './TransactionList';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      access_token: this.props.token,
      subscriptionid: this.props.subscriptionid,
      doctypeid: this.props.doctypeid,
      docid: this.props.docid,
      view: this.props.view,
      subscription: null,
      environment: this.props.environment,
      debug: this.props.debug,
      culture: this.props.culture,
      userlink: this.props.userlink
    };
    
    if (!this.state.environment) {
      this.setState({environment: "sandbox"});
    }
  }

  componentDidMount() {
    this.getToken();
    this.getSubscriptions();
  }

  getToken() {
    var component = this;
    // ..
    var data = "grant_type=client_credentials&scope=core&=";
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = false;
    xhr.addEventListener("readystatechange", function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          var token_response = JSON.parse(xhr.response);
          component.setState({new_token: token_response.access_token});
        } else {
          component.setState({
            access_token: 'failed! with status :' + xhr.statusText
          });
        }
      }
    });

    xhr.open("POST", "http://www.incontrl.io/connect/token", true);
    xhr.setRequestHeader("Authorization", "Basic bmxnLXdvcmRwcmVzcy1vbmxpbmU6d0VzR0xnYVh5azJvZXVwR1Q0cGZXZw==");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader("Cache-Control", "no-cache");
    xhr.send(data);
  }

  getSubscriptions() {
    var component = this;
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        if (xhr.status === 200) {
          var subscriptions_response = JSON.parse(xhr.response);
          component.setState({
            subscription: JSON.stringify(subscriptions_response.items[0])
          });
        } else {
          component.setState({subscription: null});
        }
      }
    });
    xhr.open("GET", `https://${component.state.environment}.incontrl.io/subscriptions`);
    xhr.setRequestHeader("Authorization", "Bearer " + this.state.access_token);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Cache-Control", "no-cache");
    xhr.send();
  }

  appView() {
    if (this.state.view === 'list' || this.state.view === 'documents' ) {
      return (<DocumentList
        token={this.state.access_token}
        subscriptionid={this.state.subscriptionid}
        doctypeid={this.state.doctypeid}
        environment={this.state.environment}
        culture={this.state.culture}
        userlink={this.state.userlink}/>);
    } else if (this.state.view === 'transactions') {
      return (<TransactionList
        token={this.state.access_token}
        subscriptionid={this.state.subscriptionid}
        paymentoptionid={this.state.paymentoptionid}
        environment={this.state.environment}
        culture={this.state.culture}
        userlink={this.state.userlink}/>);
    } else {
      return (
        <h1>invalid view parameter</h1>
      );
    }
  }

  debugInfo() {
    if (this.state.debug) {
      return (
        <div>
          <hr/>
          <p>
            <strong>APP STATE:</strong><br/>
            <code>{JSON.stringify(this.state)}</code>
          </p>
          <p>
            <strong>NEW TOKEN:</strong><br/>
            <code>{this.state.new_token}</code>
          </p>
        </div>
      );
    } else {
      return '';
    }
  }

  render() {
    return (
      <div>
        {this.appView()}
        {this.debugInfo()}
      </div>
    );
  }
}

export default App;