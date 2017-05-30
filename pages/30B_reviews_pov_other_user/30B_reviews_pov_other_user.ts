import { Component, Inject, forwardRef } from '@angular/core';

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

    constructor(public navCtrl: NavController, public navParams: NavParams, @Inject(forwardRef(() => Globals)) public globals: Globals, public af: AngularFireDatabase) {
        this.userUID = navParams.get('userUid');
        globals.af.list('/reviews/' + this.userUID + '/done').$ref.once("value", (_reviews: firebase.database.DataSnapshot) => {
            let reviews: Object = _reviews.val();
            for (let review_key in reviews) {
                let review: Review = reviews[review_key];
                if (review != null) {
                    globals.af.object('/users/' + review.UID_Writer).$ref.once("value", (_user: firebase.database.DataSnapshot) => {
                        review.$key = review_key;
                        let user: FeasyUser = _user.val();
                        (review as any).PhotoURL = SetImageOrDefaultOtherUser(user.Gender, user.PhotoURL);
                        this.UserReviews.push(review);
                        globals.RecopyArray(this.UserReviews);
                    });    
                }   
            }

            
        });
       

    }

    goToSingleReview(review: any, _photo_url: string): void {
        console.log("going to single review page");
        this.navCtrl.push(SingleReviewDisplayPage, { review: review });

    }

}