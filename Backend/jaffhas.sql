-- phpMyAdmin SQL Dump
-- version 4.1.12
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Nov 30, 2014 at 08:28 AM
-- Server version: 5.6.16
-- PHP Version: 5.5.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `jaffhas`
--

-- --------------------------------------------------------

--
-- Table structure for table `passenger_to_rider_request`
--

CREATE TABLE IF NOT EXISTS `passenger_to_rider_request` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `passenger_user_id` int(11) NOT NULL,
  `rider_user_id` int(11) NOT NULL,
  `pickup_point` int(11) NOT NULL,
  `drop_point` varchar(255) NOT NULL,
  `when_to_pickup` varchar(255) NOT NULL,
  `status` int(11) NOT NULL,
  `request_time_sent` varchar(256) NOT NULL,
  `created_date_time` varchar(200) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- Dumping data for table `passenger_to_rider_request`
--

INSERT INTO `passenger_to_rider_request` (`id`, `passenger_user_id`, `rider_user_id`, `pickup_point`, `drop_point`, `when_to_pickup`, `status`, `request_time_sent`, `created_date_time`) VALUES
(1, 420, 143, 0, 'agara', '12-2-2014 8pm', 0, '12-2-2014 8pm', '2014-11-29 17:45:59'),
(2, 420, 143, 0, 'agara', '12-2-2014 8pm', 0, '12-2-2014 8pm', '2014-11-29 17:46:44'),
(3, 420, 143, 0, 'agara', '12-2-2014 8pm', 0, '12-2-2014 8pm', '2014-11-29 17:47:02');

-- --------------------------------------------------------

--
-- Table structure for table `rider_to_passenger_request`
--

CREATE TABLE IF NOT EXISTS `rider_to_passenger_request` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `passenger_user_id` int(11) NOT NULL,
  `rider_user_id` int(11) NOT NULL,
  `pickup_point` int(11) NOT NULL,
  `drop_point` varchar(255) NOT NULL,
  `when_to_pickup` datetime NOT NULL,
  `status` int(11) NOT NULL,
  `request_time_sent` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `rider_to_passenger_request`
--

INSERT INTO `rider_to_passenger_request` (`id`, `passenger_user_id`, `rider_user_id`, `pickup_point`, `drop_point`, `when_to_pickup`, `status`, `request_time_sent`) VALUES
(1, 420, 143, 0, 'agara', '0000-00-00 00:00:00', 0, '2014-11-29 17:47:45');

-- --------------------------------------------------------

--
-- Table structure for table `rides`
--

CREATE TABLE IF NOT EXISTS `rides` (
  `ride_id` int(11) NOT NULL AUTO_INCREMENT,
  `rider_user_id` int(11) NOT NULL,
  `source` varchar(255) NOT NULL,
  `destination` varchar(255) NOT NULL,
  `price` varchar(11) NOT NULL,
  `depart_on_date_time` datetime NOT NULL,
  `created_date_time` datetime NOT NULL,
  PRIMARY KEY (`ride_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=13 ;

--
-- Dumping data for table `rides`
--

INSERT INTO `rides` (`ride_id`, `rider_user_id`, `source`, `destination`, `price`, `depart_on_date_time`, `created_date_time`) VALUES
(1, 1, 'Bommanahalli Bus Stop, Service Rd, Bommanahalli, Bengaluru, Karnataka 560068', 'Electronic City Phase 1 Bus Stop, Hewlett Packard Ave, Konappana Agrahara, Electronic City, Bengaluru, Karnataka 560100', '1', '2014-11-29 09:30:00', '2014-11-29 09:30:00'),
(2, 1, 'HSR BDA Complex Bus Stand, 14th Main Rd, Sector 6, HSR Layout, Bengaluru, Karnataka 560102', 'Electronic City Phase 1 Bus Stop, Hewlett Packard Ave, Konappana Agrahara, Electronic City, Bengaluru, Karnataka 560100', '1', '2014-11-30 04:10:12', '2014-11-29 00:00:00'),
(3, 1, 'Silk Board, Koramangala 1st Block, Venkatapura, HSR Layout, Bengaluru, Karnataka 560034', 'Electronic City Phase 1 Bus Stop, Hewlett Packard Ave, Konappana Agrahara, Electronic City, Bengaluru, Karnataka 560100', '1', '2014-11-29 20:30:36', '2014-11-29 11:29:29'),
(4, 1, 'btm layout', 'agara', '100', '0000-00-00 00:00:00', '2014-11-29 17:07:47'),
(10, 1, 'Hsr layout', 'Jayadeva', '10', '0000-00-00 00:00:00', '2014-11-29 17:44:07'),
(11, 2, 'btm layout', 'agara', '100', '0000-00-00 00:00:00', '2014-11-30 06:30:06'),
(12, 1, 'btm layout', 'agara', '100', '2014-10-11 11:15:00', '2014-11-30 06:44:32');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `user_id` int(128) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `gender` enum('Male','Female') NOT NULL,
  `date_of_birth` date NOT NULL,
  `phone_number` varchar(255) NOT NULL,
  `profile_photo` text NOT NULL,
  `access_token` varchar(255) NOT NULL,
  `ip_address` varchar(255) NOT NULL,
  `created_date_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `modified_date` datetime NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5 ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `name`, `email`, `password`, `gender`, `date_of_birth`, `phone_number`, `profile_photo`, `access_token`, `ip_address`, `created_date_time`, `modified_date`) VALUES
(1, 'manju', 'manju345@gmail.com', '81dc9bdb52d04dc20036dbd8313ed055', 'Male', '0000-00-00', '12-3-1988', '', 'c97902b11365b8af22fee80456a8490b', '192.168.5.71', '2014-11-30 04:51:26', '0000-00-00 00:00:00'),
(2, 'honey11', 'h@gmail.com', '81dc9bdb52d04dc20036dbd8313ed055', 'Female', '1987-07-13', '8050691172', 'hello', 'f7982008078ad980ce8ef05b33a9f174', '192.168.5.106', '2014-11-30 01:09:14', '0000-00-00 00:00:00'),
(3, 'dhruv', 'd@gmail.com', '81dc9bdb52d04dc20036dbd8313ed055', 'Male', '0000-00-00', '9538679902', '', 'b1a01642dd68fcd53145cee31a0d10fe', '192.168.6.247', '2014-11-30 04:56:01', '0000-00-00 00:00:00'),
(4, 'manjunath', 'manjunath@gmail.com', '81dc9bdb52d04dc20036dbd8313ed055', 'Male', '0000-00-00', '123198813', '', '54c974ebe938b4da7cce73e541d94c32', '192.168.5.71', '2014-11-30 05:15:18', '0000-00-00 00:00:00');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
