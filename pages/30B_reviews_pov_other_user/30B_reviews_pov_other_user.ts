import { Component } from '@angular/core';

import { NavController, NavParams, AlertController, Tabs } from 'ionic-angular';



import { FeasyUser, FeasyList, FeasyItem, Review, SetImageOrDefaultOtherUser } from '../../classes/Feasy';
import { Globals } from '../../classes/Globals';

import { SingleReviewDisplayPage } from '../../pages/31A_single_review_display/31A_single_review_display';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';

@Component({
    selector: 'page-reviews-pov-other-user',
    templateUrl: '30B_reviews_pov_other_user.html'
})

export class ReviewsPovOtherUserPage {

    public userUID: string;    
    public UserReviews: Array<Review> = new Array<Review>();

    constructor(public navCtrl: NavController, public navParams: NavParams, public globals: Globals, public af: AngularFireDatabase) {
        this.userUID = navParams.get('userUid');
        globals.af.object('/users/' + this.userUID).$ref.once("value", (_user: firebase.database.DataSnapshot) => {    
            globals.af.list('/reviews/' + this.userUID + '/done').$ref.once("value", (_review: firebase.database.DataSnapshot) => {
                let review: Review = _review.val();
                let user: FeasyUser = _user.val();
                //review.$key = _review.key;
                if (review != null) {
                        (review as any).PhotoURL = SetImageOrDefaultOtherUser(user.Gender, user.PhotoURL);
                        this.UserReviews.push(review);
                        globals.RecopyArray(this.UserReviews);   
                }
            });
        });

    }

    goToSingleReview(review: any, _photo_url: string): void {
        console.log("going to single review page");
        this.navCtrl.push(SingleReviewDisplayPage, { review: review, photo_url: _photo_url });

    }

}