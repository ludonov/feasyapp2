
  /*******************************************************************
  * FeasyService.js
  * Generated by Backendless Corp.
  ********************************************************************/
		
(function () {
    var serviceName = "FeasyService";
    var serviceVersion = "1.0.0";

    function FeasyService()
	{
      this.serviceVersion = serviceVersion;
      this.serviceName = serviceName;

      
	  this.addCandidateToList = function ( arg0, arg1, asyncObj )
	  {
          if( !(arg0 instanceof CandidateInfo) )
        throw new Error( "Invalid value for argument 'value'. Must be an CandidateInfo object" );  if( !Backendless.Utils.isString(arg1 ) )
                throw new Error( "Invalid value for argument 'value'. Must be string value" );
        var args = {
          arg0: arg0,
          arg1: arg1
        };

        return Backendless.CustomServices.invoke( this.serviceName, this.serviceVersion, "addCandidateToList", args, asyncObj );
	  };
      
    }

    this.FeasyService = new FeasyService();
})();
