import React, { Component } from 'react';
import { fetchMovie } from "../actions/movieActions";
import {connect} from 'react-redux';
import {Card, ListGroup, ListGroupItem } from 'react-bootstrap';
import { BsStarFill } from 'react-icons/bs'
import { Image } from 'react-bootstrap';

class MovieDetail extends Component {

    componentDidMount() {
        const {dispatch} = this.props;
        if (this.props.selectedMovie == null) {
            dispatch(fetchMovie(this.props.movieId));
        }
    }

    render() {
        const DetailInfo = () => {
            if (!this.props.selectedMovie) {
                return <div>Loading....</div>
            }

            return (
                <Card>
                    <Card.Header>Movie Detail</Card.Header>
                    <Card.Body>
                        <Image className="image" src={this.props.selectedMovie.imageUrl} thumbnail />
                    </Card.Body>
                    <ListGroup>
                        <ListGroupItem>
                            {Array.isArray(this.props.selectedMovie.actors) ? (
                                this.props.selectedMovie.actors.map((actor, i) => (
                                    <p key={i}>
                                        <b>{actor.actorName}</b> {actor.characterName}
                                    </p>
                                ))
                            ) : (
                                <p>No actor data available</p>
                            )}
                        </ListGroupItem>
                        <ListGroupItem>
                            <h4><BsStarFill /> {this.props.selectedMovie.avgRating?.toFixed(1) || "No rating"}</h4>
                        </ListGroupItem>

                    </ListGroup>
                    <Card.Body>
                        {Array.isArray(this.props.selectedMovie.movieReviews) ? (
                            this.props.selectedMovie.movieReviews.map((review, i) => (
                                <p key={i}>
                                    <b>{review.username}</b>&nbsp; {review.review}
                                    &nbsp; <BsStarFill /> {review.rating}
                                </p>
                            ))
                        ) : (
                            <p>No reviews found</p>
                        )}

                    </Card.Body>
                </Card>
            )
        }

        return (
            <DetailInfo />
        )
    }
}

const mapStateToProps = state => {
    return {
        selectedMovie: state.movie.selectedMovie
    }
}

export default connect(mapStateToProps)(MovieDetail);
