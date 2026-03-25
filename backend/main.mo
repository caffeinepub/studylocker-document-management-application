import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Storage "blob-storage/Storage";

actor {
  // Initialize the access control state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // User Profile Type
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Management Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Document Management
  module Document {
    public func compare(doc1 : Document, doc2 : Document) : Order.Order {
      Text.compare(doc1.fileName, doc2.fileName);
    };
  };

  type Document = {
    id : Text;
    fileName : Text;
    fileType : Text;
    uploadDate : Int;
    fileSize : Nat;
    storage : Storage.ExternalBlob;
  };

  let documents = Map.empty<Principal, Map.Map<Text, Document>>();

  public shared ({ caller }) func uploadDocument(
    docId : Text,
    fileName : Text,
    fileType : Text,
    uploadDate : Int,
    fileSize : Nat,
    blob : Storage.ExternalBlob,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can upload documents");
    };

    let document : Document = {
      id = docId;
      fileName;
      fileType;
      uploadDate;
      fileSize;
      storage = blob;
    };

    let userDocs = switch (documents.get(caller)) {
      case (null) {
        let newDocs = Map.empty<Text, Document>();
        newDocs.add(docId, document);
        newDocs;
      };
      case (?docs) {
        docs.add(docId, document);
        docs;
      };
    };

    documents.add(caller, userDocs);
  };

  public shared ({ caller }) func deleteDocument(docId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete documents");
    };

    switch (documents.get(caller)) {
      case (null) { Runtime.trap("Document not found") };
      case (?userDocs) {
        if (not userDocs.containsKey(docId)) {
          Runtime.trap("Document not found");
        };
        userDocs.remove(docId);
      };
    };
  };

  public query ({ caller }) func getMyDocuments() : async [Document] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view documents");
    };

    switch (documents.get(caller)) {
      case (null) { [] };
      case (?userDocs) {
        userDocs.values().toArray().sort();
      };
    };
  };

  public query ({ caller }) func getDocumentById(docId : Text) : async ?Document {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view documents");
    };

    switch (documents.get(caller)) {
      case (null) { null };
      case (?userDocs) {
        userDocs.get(docId);
      };
    };
  };
};
