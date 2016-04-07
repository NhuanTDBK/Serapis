var CONTAINERS_URL = "/api/containers/";
module.exports = function(File) {
/*
  Upload file
*/
  File.upload = function(ctx,container,cb){
      ctx.req.params.container = container;
      File.app.models.container.upload(ctx.req,ctx.result,container,function(err,fileObject){
          if(err)
            cb(err);
          else {
            var fileInfo = fileObject.files.file[0];
            File.create({
              name:fileInfo.name,
              type:fileInfo.type,
              container:fileInfo.container,
              url: CONTAINERS_URL+fileInfo.container+'/download/'+fileInfo.name
            },function(err,obj){
                if(err!=null){
                  cb(err);
                }
                else{
                  cb(null,obj);
                }
            });
          }
      });
  };
  File.remoteMethod('upload',{
      description:'Uploads a file',
      accepts:[
        {arg:'ctx',type:'object',http:{source:'context'}},
        {arg:'container',type:'string',required:true}
      ],
      returns:{
        arg:'fileObject',type:'object',root:true
      },
      http:{
        verb:'post',
        path:'/:container'
      }
  });
/*
  Download file
*/
  File.download = function(ctx,container,file,cb){
    ctx.req.params.container = container;
    ctx.req.params.file = file;
    File.app.models.container.download(ctx.req,ctx.result,container,file,function(err,fileObject){
      if(err)
        cb(null,err)
      else {
        cb(null,fileObject);
      }
    });
  }
  File.remoteMethod('download',{
    description:'Downloads a file',
    accepts:[
      {arg:'ctx',type:'object',http:{source:'context'}},
      {arg:'container',type:'string',required:true},
      {arg:'file',type:'string',required:true},
    ],
    returns:{
      arg:'fileObject',type:'object',root:true
    },
    http:{
      verb:'get',
      path:'/:container/:file'
    }
  });
};
