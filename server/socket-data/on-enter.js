/**
 * Created by maxislav on 29.12.16.
 */
let connection;


class OnEnter{
  set connection(con){
    this._connection = con;
  }
  get connection(){
    return this._connection;
  }
}

module.exports = new OnEnter();